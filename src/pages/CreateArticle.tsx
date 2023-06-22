import "@uploadthing/react/styles.css";
import { useRef, useState } from "react";
import Image from "next/image";
import { NavBar } from "~/components/NavBar";
import { api } from "~/utils/api";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react"
import type { NextPage } from "next";
import { UploadButton } from "@uploadthing/react";
import axios from "axios";

const CreateArticle: NextPage = () => {
    return (
        <>
            <ArticleEditor />
        </>
    );
};

export function TitleAndAction({
    title,
    action,
}: {
    title: string;
    action: string;
}) {
    return (
        <div className="mt-12 flex items-center gap-8 border">
            <h1 className=" border text-5xl">{title}</h1>
            <button className="h-9 rounded bg-blue-600 px-3 text-white">
                {action}
            </button>
        </div>
    );
}
type ArticleEditorProps = {
    isNew?: boolean;
    title?: string;
    image?: string;
    content?: string;
    id?: string;
};
export function ArticleEditor({
    isNew = true,
    title = "",
    image = "",
    content = "",
    id,
}: ArticleEditorProps) {
    //hooks
    const { data: createSignedUrls } = api.article.createPresignedUrls.useQuery({ count: 1 })
    const [signedUrl, setSignetUrl] = useState<string>()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [file, setFile] = useState<unknown>()
    const [imgFile, setImgFile] = useState<File>()
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [imgSrc, setImgSrc] = useState<string>(image);
    const [hasImage, setHasImage] = useState(false);
    const [formData, setFormData] = useState({
        title: title,
        image: image,
        content: content,
    });


    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const handleUploadImageButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        inputRef.current && inputRef.current.click();
    };

    const createArticle = api.article.create.useMutation({
        async onSuccess() {
            console.log("article created");
            setFormData({
                title: "",
                image: "",
                content: "",
            });
            await router.push("/blog");
        },
    });
    const updateArticle = api.article.update.useMutation({
        onSuccess() {
            console.log("article updated");
            setFormData({
                title: "",
                image: "",
                content: "",
            });
            redirect("/MyArticles");
        },
    });
    const uploadImage = api.s3.upload.useMutation({ onSuccess() { console.log('server got the image') } })

    const testInputRef = useRef<HTMLInputElement>(null)
    const triggerHiddenInputFileElement = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        testInputRef.current && testInputRef.current.click()
    }
    const mockHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData2 = new FormData()
        formData2.append('file', 'file')
        if (!signedUrl) return

        await axios.put(signedUrl, file, {
            headers:
            {
                'Content-Type': 'image/jpeg',
            },
        })


        console.log('submititng form');
    }

    const getSignedUrl = () => {
        if (!(createSignedUrls && createSignedUrls[0])) return
        setSignetUrl(createSignedUrls[0].url)
        console.log('signedUrl:', signedUrl)
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!(e.target.files && e.target.files[0])) return
        getSignedUrl()
        setFile(e.target.files[0]); console.log('image selected', imgFile)
    }

    return (
        <>
            <NavBar />
            <div className="max-w-4xl">
                <form
                    className='flex flex-col'
                    onSubmit={(e) => { mockHandleSubmit(e).catch((e) => console.log(e)); }}
                >
                    <div>Image Test</div>
                    <div>impage - preview</div>
                    <input type="file" accept="image/*" ref={testInputRef}
                        name='upload file'
                        onClick={() => { console.log('brawsing for image') }}
                        onChange={(e) => { handleFileChange(e) }} />
                    <button type='button' name="browse"
                        onClick={(e) => { console.log('trigger hidden input file element'); triggerHiddenInputFileElement(e) }}
                    >Upload Image</button>
                    <button type='submit'
                        onClick={() => { console.log('special action'); }}
                    >submit test form</button>
                </form>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        isNew
                            ? createArticle.mutate({ ...formData })
                            : id == undefined
                                ? null
                                : updateArticle.mutate({ ...formData, id });
                    }}
                >
                    <TitleAndAction
                        title={isNew ? "Create new article" : "Edit article"}
                        action={"Publish Article"}
                    />
                    <div className="mt-8 border ">Article Title</div>
                    <input
                        placeholder="My First Article"
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        className="mt-2 w-full rounded border px-4 py-2 text-xl"
                        onChange={handleInputChange}
                    />

                    <div className="mt-8 border">Featured image</div>
                    {hasImage ? (
                        <Image src={imgSrc} alt="blog image" width={112} height={74} />
                    ) : null}
                    <input
                        hidden
                        type="file"
                        name="image"
                        id="file"
                        value={formData.image}
                        style={{ display: "none" }}
                        onChange={handleInputChange}
                        ref={inputRef}
                    />
                    <button
                        className="mt-2 h-9 rounded bg-gray-500 px-3 text-white"
                        onClick={handleUploadImageButtonClick}
                    >
                        Upload an Image
                    </button>
                    <div className="">
                    </div>
                    <div className="mt-10 border">Content</div>
                    <textarea

                        placeholder="Supports markdown. Yay!"
                        name="content"
                        id="contnet"
                        value={formData.content}
                        className="gray-500 mb-36 mt-2 h-screen w-full resize-none rounded border px-4 py-2 text-xl"
                        onChange={handleInputChange}
                    ></textarea>
                </form>
            </div>
        </>
    );
}
export default CreateArticle;
