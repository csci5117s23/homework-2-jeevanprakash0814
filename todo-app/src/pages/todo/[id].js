import { useRouter } from "next/router";
import TodoFull from "@/components/TodoFull";
import Navbar from "@/components/Navbar";
import { useAuth } from "@clerk/nextjs";
import Head from 'next/head'

export default function todoPage() {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    const {id} = router.query;

    if (!isLoaded) return <><span> loading ... </span></>;
    else if (isLoaded && !isSignedIn) router.push("/");
    else {
        return <>
            <Head>
                <title>To-Do Item {id}</title>
                <meta name="description" content="Full To-Do Item" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/check_mark.ico" />
            </Head>
            <Navbar />
            <TodoFull id={id}></TodoFull>
        </>
    }
}