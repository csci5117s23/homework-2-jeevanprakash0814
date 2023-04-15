import Head from 'next/head'

export default function TodoFull({ id }) {
    return <>
        <Head>
            <title>To-Do Item {id}</title>
            <meta name="description" content="Full To-Do Item" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/check_mark.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="relative place-items-center">
                {text}
            </div>
        </main>
    </>
}