import { articleRouter } from "./routers/article";
import { commentRouter } from "./routers/comment";
import { createTRPCRouter } from "~/server/api/trpc";
import { profileRouter } from "./routers/profile";
import { tweetRouter } from "~/server/api/routers/tweet";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    tweet: tweetRouter,
    comment: commentRouter,
    profile: profileRouter,
    article: articleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
