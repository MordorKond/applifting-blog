import { TitleAndAction } from "./CreateArticle";
import { api } from "~/utils/api";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import OrderIcon from "images/Union.svg";
import TrashImg from "images/trash.svg";
import PenImg from "images/pen.svg";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import type { ReactNode } from "react";

const orderIcon = OrderIcon as string
const trashImg = TrashImg as string
const penImg = PenImg as string

const MyArticles: NextPage = () => {
    const session = useSession()
    const router = useRouter()
    if (session.status !== 'authenticated') return null
    const handleClick = async () => {
        await router.push("/CreateArticle");
    };
    return (
        <>
            <div className=""></div>
            <TitleAndAction title={ARTICLES} action={"Create new article"} fn={() => handleClick} />
            <ArticlesTable />
        </>
    );
};




interface CheckedItems {
    [key: string]: boolean;
}
function ArticlesTable() {
    const trpcUtils = api.useContext()
    const articles = api.article.getProfileArticles.useQuery({ userId: "" });
    const deleteArticle = api.article.delete.useMutation({
        onSuccess: async () => {
            //todo Optimise the invalidation
            await trpcUtils.invalidate()
        },
    });

    const [selectAll, setSelectAll] = useState(false);
    const [checkedItems, setCheckedItems] = useState<CheckedItems>({});

    const items = (articles && articles.data) ? articles.data.map(x => x.id) : []

    const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectAll(event.target.checked);
        setCheckedItems(items.reduce((acc, item) => ({ ...acc, [item]: event.target.checked }), {}));
    };

    const handleItemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedItems({ ...checkedItems, [event.target.name]: event.target.checked });
        setSelectAll(Object.values(checkedItems).every((checked) => checked));
    };
    return (
        <table className="mt-9 w-full ">
            <thead>
                <tr className="border-b-2 gap-4 ">
                    <th className="">
                        <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
                    </th>
                    <th className=" w-64 p-3 text-start">
                        <HeaderWrap>Article title</HeaderWrap>
                    </th>
                    <th className="max-w-md p-3 text-start">
                        <HeaderWrap>Perex</HeaderWrap>
                    </th>
                    <th className=" w-40 p-3 text-start">
                        <HeaderWrap>Author</HeaderWrap>
                    </th>
                    <th className=" w-40 p-3 text-start">
                        <HeaderWrap># of comments</HeaderWrap>
                    </th>
                    <th className=" w-28 p-3 text-start mr-4">Actions</th>
                </tr>
            </thead>
            <tbody>
                {articles.data?.map((x) => {
                    return (
                        <tr key={x.id} className="-2 -b">
                            <td className="">
                                <input
                                    className='m-3'
                                    type="checkbox"
                                    name={x.id}
                                    checked={checkedItems[x.id] || false}
                                    onChange={handleItemChange}
                                />

                            </td>
                            <TdWrap className='w-64'>{x.title}</TdWrap>
                            <TdWrap className='max-w-md'>{x.perex}</TdWrap>
                            <TdWrap className='w-40 '>{x.user.name}</TdWrap>
                            <TdWrap className='w-40'>{x.comments.length}</TdWrap>
                            <td className="border-b">
                                <div className="flex items-center gap-3 px-3">
                                    <Link href={`/Edit/${x.id}`}>
                                        <Image id="eddit" className="m-2 " src={penImg} alt="eddit icon" />
                                    </Link>
                                    <button
                                        id='delete'
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

interface WrapProps {
    children: ReactNode;
}
const HeaderWrap: React.FC<WrapProps> = ({ children }) => {
    return (
        <div className="flex gap-2">
            {children}
            <Image src={orderIcon} alt="order by icon" />
        </div>
    );
};
interface WrapProps2 {
    children: ReactNode;
    className?: string;
}

const TdWrap: React.FC<WrapProps2> = ({ children, className = '' }) => {
    return (
        <td className={`p-3 overflow-hidden text-ellipsis whitespace-nowrap border-b ${className}`}>{
            children
        }</td>
    );
};
export default MyArticles;
