import type { NextPage } from "next";
import { ArticleCardList } from "~/components/ArticleCard";

const Blog: NextPage = () => {

    return (
        <>
            <h1 className="mt-16 text-5xl">Recent articles</h1>
            <ArticleCardList />
        </>
    );
};

export default Blog;
