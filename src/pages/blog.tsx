import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { InfiniteTweetList } from "~/components/InfiniteTweetList";
import { NewTweetForm } from "~/components/NewTweetForm";
import { api } from "~/utils/api";
import logoSrc from "images/logo.svg";
import arrowSrc from "images/Arrow.svg";
import catSrc from "images/cat1.svg";
import Image from "next/image";
import { VscArrowRight } from "react-icons/vsc";
import Link from "next/link";
import { sign } from "crypto";
import { NavBar } from "~/components/NavBar";
import { ArticleCard, ArticleCardList } from "~/components/ArticleCard";
import type { ArticleCardProps } from "~/components/ArticleCard";

// export const articles: ArticleCardProps[] = [
//   {
//     id: "0",
//     image: catSrc,
//     title: "Why Do Cats Have Whiskers?",
//     author: "Elisabeth Strain",
//     date: "02/13/17",
//     description:
//       "A cat's whiskers — or vibrissae — are a well-honed sensory tool that helps a cat see in the dark and steer clear of hungry predators. Whiskers are highly sensitive tactile hairs that grow in patterns on a cat's muzzle, above its eyes and elsewhere on its body, like the ears, jaw and forelegs",
//     commentsCount: 4,
//   },
//   {
//     id: "1",
//     image: catSrc,
//     title: "Why Do Cats Have Whiskers?",
//     author: "Elisabeth Strain",
//     date: "02/13/17",
//     description:
//       "A cat's whiskers — or vibrissae — are a well-honed sensory tool that helps a cat see in the dark and steer clear of hungry predators. Whiskers are highly sensitive tactile hairs that grow in patterns on a cat's muzzle, above its eyes and elsewhere on its body, like the ears, jaw and forelegs",
//     commentsCount: 4,
//   },
// ];
// export const data = { articles };
const Blog: NextPage = () => {
  const trpcUtils = api.useContext();
  const articles = api.article.getProfileArticles.useQuery({});
  const title = "Why Do Cats Have Whiskers?";
  const author = "Elisabeth Strain";
  const date = "02/13/17";
  const description =
    "A cat's whiskers — or vibrissae — are a well-honed sensory tool that helps a cat see in the dark and steer clear of hungry predators. Whiskers are highly sensitive tactile hairs that grow in patterns on a cat's muzzle, above its eyes and elsewhere on its body, like the ears, jaw and forelegs";
  const commentsCount = 4;

  return (
    <>
      <NavBar />
      <h1 className="mt-16 border text-5xl">Recent articles</h1>

      <ArticleCardList />
    </>
  );
};

export default Blog;
