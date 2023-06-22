import { NextPage } from "next";

import { NavBar } from "~/components/NavBar";
import { TitleAndAction } from "./CreateArticle";
import { table } from "console";
import { api } from "~/utils/api";
import orderIcon from "images/Union.svg";
import Image from "next/image";
import trashImg from "images/trash.svg";
import penImg from "images/pen.svg";
import type { ReactNode } from "react";
import Link from "next/link";

const MyArticles: NextPage = () => {
  return (
    <>
      <div className="border"></div>
      <NavBar />
      <TitleAndAction title={"My articles"} action={"Create new article"} />
      <ArticlesTable />
    </>
  );
};

function ArticlesTable() {
  const trpcUtils = api.useContext();
  const articles = api.article.getProfileArticles.useQuery({ userId: "" });
  const deleteArticle = api.article.delete.useMutation({
    onSuccess: () => {
      //todo Optimise the invalidation
      const updater = trpcUtils.article.invalidate();
    },
  });

  return (
    <table className="mt-9 w-full ">
      <thead>
        <tr className=" gap-4 divide-x-2 border">
          <th className=" w-9 p-3 text-start">
            <input type="checkbox" />
          </th>
          <th className="flex w-64 p-3 text-start">
            <Wrap>Article title</Wrap>
          </th>
          <th className="max-w-md p-3 text-start">
            <Wrap>Perex</Wrap>
          </th>
          <th className=" w-40 p-3 text-start">
            <Wrap>Author</Wrap>
          </th>
          <th className=" w-40 p-3 text-start">
            <Wrap># of comments</Wrap>
          </th>
          <th className=" w-28 p-3 text-start">Actions</th>
        </tr>
      </thead>
      <tbody>
        {articles.data?.map((x) => {
          return (
            <tr key={x.id} className="divide-x-2 border-2 border-b">
              <td className="px-3 ">
                <input type="checkbox" />
              </td>
              <td className="p-3">{x.title}</td>
              <td className="p-3">{x.perex}</td>
              <td className="p-3">{x.user.name}</td>
              <td className="p-3">{x.comments.length}</td>
              <td className="">
                <div className="flex items-center gap-3 px-3">
                  <Link href={`/Edit/${x.id}`}>
                    <Image className="m-2 " src={penImg} alt="eddit icon" />
                  </Link>
                  <button
                    onClick={() =>
                      void deleteArticle.mutate({ articleId: x.id })
                    }
                  >
                    <Image className="m-2 " src={trashImg} alt="trash icon" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
type InnerTHContentWrapperProps = {
  children: ReactNode;
};
function innerTHWrapper(children: any) {
  return (
    <div className="flex gap-2">
      {children}
      <Image src={orderIcon} alt="order by icon" />
    </div>
  );
}
interface WrapProps {
  children: ReactNode;
}
const Wrap: React.FC<WrapProps> = ({ children }) => {
  return (
    <div className="flex gap-2">
      {children}
      <Image src={orderIcon} alt="order by icon" />
    </div>
  );
};
export default MyArticles;
