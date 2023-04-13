import Link from "next/link"
import Head from 'next/head'

// code used from https://www.netlify.com/blog/2020/12/08/making-a-custom-404-page-in-next.js/
export default function FourOhFour() {
    return <>
        <Head>
            <title>404</title>
            <meta name="description" content="404 page" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/exclamation.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="relative place-items-center">
                <h1>404 - Page Not Found</h1>
                <Link href="/">
                    <button className="btn btn-primary">Go back home</button>
                </Link>
            </div>
        </main>
    </>
}