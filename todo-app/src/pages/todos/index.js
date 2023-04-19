import TodoList from "@/components/TodoList"
import Link from "next/link"
import Head from 'next/head'
import Navbar from "@/components/Navbar"
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';

export default function Todos({ Component, pageProps }) {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    if (!isLoaded) return <><span> loading ... </span></>;
    else if (isLoaded && !isSignedIn) router.push("/");
    else {
        return (
            <>
                <Head>
                    <title>To-Do</title>
                    <meta name="description" content="To-Do List" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/pop_icon.png" />
                </Head>
                <Navbar />
                <main className="flex min-h-screen flex-col items-center justify-between p-24">
                    <div className="relative place-items-center">
                        <TodoList></TodoList>
                        <Link href="done"><button className="btn btn-primary">Completed Items</button></Link>
                    </div>
                </main>
            </>
        );
    }
}