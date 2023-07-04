import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { NavBar } from "~/components/NavBar";

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <Head>
                <title>Blog</title>
                <meta
                    name="description"
                    content="This is a blog designed by Applifting"
                />
            </Head>
            <NavBar />
            <div className="container px-56 mx-auto flex items-start sm:pr-4">
                <div className="min-h-screen flex-grow ">
                    <Component {...pageProps} />
                </div>
            </div>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
