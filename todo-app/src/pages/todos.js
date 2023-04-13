import TodoList from "@/components/TodoList"
import Link from "next/link"
import Head from 'next/head'

export default function Todos({ Component, pageProps }) {
    return <>
        <Head>
            <title>To-Do</title>
            <meta name="description" content="To-Do List" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/check_mark.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="relative place-items-center">
                <TodoList></TodoList>
                <Link href="done"><button className="btn btn-primary">Completed Items</button></Link>
            </div>
        </main>
    </>
}