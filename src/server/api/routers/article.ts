import { v4 as uuidv4 } from 'uuid'
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '~/server/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export const articleRouter = createTRPCRouter({
    createPresignedUrls: protectedProcedure
        .input(z.object({ count: z.number().gte(1).lte(4) }))
        .query(async ({ input }) => {
            const urls = [];
            for (let i = 0; i < input.count; i++) {
                const key = uuidv4();

                const url = await getSignedUrl(
                    s3Client,
                    new PutObjectCommand({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: key,
                        ContentType: 'image/jpeg'
                    })
                );

                urls.push({
                    url,
                    key,
                });
            }

            return urls;
        }),
    getArticleById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input: { id }, ctx }) => {
            const article = await ctx.prisma.article.findUnique({
                where: { id },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    user: { select: { name: true } },
                    image: true,
                    createdAt: true,
                    perex: true,
                    comments: true,
                    _count: { select: { comments: true } },
                },
            });
            if (article == null) return;
            return {
                ...article,
            };
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                content: z.string(),
                title: z.string(),
                image: z.string(),
            })
        )
        .mutation(async ({ input: { id, content, image, title }, ctx }) => {
            await ctx.prisma.article.update({
                where: { id },
                data: {
                    title,
                    content,
                    image,
                },
            });
        }),
    delete: protectedProcedure
        .input(z.object({ articleId: z.string() }))
        .mutation(async ({ input: { articleId }, ctx }) => {
            await ctx.prisma.article.delete({ where: { id: articleId } });
        }),
    create: protectedProcedure
        .input(
            z.object({ content: z.string(), title: z.string(), image: z.string() })
        )
        .mutation(async ({ input: { title, content, image }, ctx }) => {
            const article = await ctx.prisma.article.create({
                data: {
                    title,
                    image,
                    content,
                    userId: ctx.session.user.id,
                    perex: content,
                },
            });

            return article;
        }),
    getProfileArticles: publicProcedure
        .input(z.object({ userId: z.string().optional() }))
        .query(async ({ ctx }) => {
            const currentUserId = ctx.session?.user.id;
            const data = ctx.prisma.article.findMany({
                select: {
                    id: true,
                    title: true,
                    perex: true,
                    user: { select: { name: true } },
                    comments: true,
                    // todo implement direct comment count
                    // _count:{select:{comments}}
                    createdAt: true,
                },
                where: {
                    user: { id: currentUserId },
                },
                orderBy: { createdAt: "desc" },
            });
            return data;
        }),
    getArticles: publicProcedure.query(async ({ ctx }) => {
        const data = ctx.prisma.article.findMany({
            take: 100,
            select: {
                id: true,
                title: true,
                image: true,
                perex: true,
                content: true,
                user: { select: { name: true } },
                createdAt: true,
                _count: { select: { comments: true } },
                comments: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return data;
    }),
});
