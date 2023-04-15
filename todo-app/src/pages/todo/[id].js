import { useRouter } from "next/router";
import TodoFull from "@/components/TodoFull";
import Navbar from "@/components/Navbar";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import Head from 'next/head'

export default function todoPage() {
    const router = useRouter();
    const {id} = router.query;
    const text = "just testing";
    if (text) {
        return <>
            <SignedIn>
                <Head>
                    <title>To-Do Item {id}</title>
                    <meta name="description" content="Full To-Do Item" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/check_mark.ico" />
                </Head>
                <Navbar />
                <TodoFull id={id}></TodoFull>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn /> {/* change to redirect to / page */}
            </SignedOut>
        </>
    } else {
        return <></>
    }
}