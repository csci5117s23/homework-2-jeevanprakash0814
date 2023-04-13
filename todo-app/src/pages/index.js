import Head from 'next/head'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
          <title>Home</title>
          <meta name="description" content="To-do List Home Page" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/check_mark.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="relative flex place-items-center">
          <span>Jeevan's To-do List App</span>
          <p>
            <Link href="todos"> List Stuff</Link>
          </p>
        </div>
      </main>
    </>
  )
}
