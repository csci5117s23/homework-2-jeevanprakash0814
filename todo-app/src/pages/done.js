import DoneList from "@/components/DoneList"
import Link from "next/link"
import Head from 'next/head'
import Navbar from "@/components/Navbar"
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs"

export default function Done({ Component, pageProps }) {
    return <>
    <SignedIn>
        <Head>
            <title>Done</title>
            <meta name="description" content="Done List" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/check_mark.ico" />
        </Head>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="relative place-items-center">
                <DoneList></DoneList>
                <Link href="todos"><button className="btn btn-primary">Todo List</button></Link>
            </div>
        </main>
    </SignedIn>
    <SignedOut>
        <RedirectToSignIn />
    </SignedOut>
    </>
}