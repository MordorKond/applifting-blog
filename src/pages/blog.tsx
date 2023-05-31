import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { InfiniteTweetList } from "~/components/InfiniteTweetList";
import { NewTweetForm } from "~/components/NewTweetForm";
import { api } from "~/utils/api";
import logoSrc from "images/logo.svg";
import arrowSrc from "images/Arrow.svg";
import Image from "next/image";
import { VscArrowRight } from "react-icons/vsc";
import Link from "next/link";

const TABS = ["Recent", "Following"] as const;

const Blog: NextPage = () => {
  return (
    <>
      <header className="sticky flex border bg-gray-100 ">
        <Image
          className="mb-2 mt-1"
          width={39}
          src={logoSrc}
          alt={"website logo"}
        />
        <div className="mb-4 ml-10 mt-3 flex border">
          <Link href="/blog/recent-articles">
            <div className="border text-neutral-800">Recent Articles</div>
          </Link>
          <Link href="/blog/about">
            <div className="ml-10 border text-gray-500">About</div>
          </Link>
        </div>
        <div className=" flex flex-grow justify-end">
          <div className=" mb-4 mt-4 border text-blue-500">Log in</div>
          <Image
            src={arrowSrc}
            alt="arrow right"
            className="mb-4 ml-1 mt-4 border text-blue-500"
          />
        </div>
      </header>
    </>
  );
};

export default Blog;
