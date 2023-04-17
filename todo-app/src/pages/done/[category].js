import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { getCategoryDoneList, setToUndone } from "@/modules/data";
import { useRouter } from "next/router";
import Head from 'next/head'
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function DoneCategoryPage() {
    const [doneItems, setDoneItems] = useState([]);
    const [removingDone, setRemovingDone] = useState(false);

    const { isLoaded, userId, isSignedIn, getToken } = useAuth();
    const router = useRouter();

    const {category} = router.query;

    useEffect(() => {
        async function process() {
            if(userId) {
                const token = await getToken({ template: "codehooks" })
                const res = await getCategoryDoneList(token,userId,category);
                return res;
            }
        }
        process().then((res) => {
            setDoneItems(res);
        });
    }, [isLoaded,removingDone])

    if (!isLoaded) return <><span> loading ... </span></>;
    else if (isLoaded && !isSignedIn) router.push("/");
    else if (!doneItems) router.push("/404");
    else {
        const doneListItems = doneItems.map((doneItem) => (
            <li key={doneItem._id}>
                {doneItem.text}
                <button
                    onClick={async () => {
                        const token = await getToken({ template: "codehooks" });
                        await setToUndone(token,userId,doneItem._id);
                        setRemovingDone(true);
                    }}
                    className="btn btn-info ml-5"
                >
                    Mark as Uncomplete
                </button>
            </li>
        ));

        return (
            <>
                <Head>
                    <title>Done Category: {category}</title>
                    <meta name="description" content="To-Do List Category" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/check_mark.ico" />
                </Head>
                <Navbar />
                <main className="flex min-h-screen flex-col items-center justify-between p-24">
                    <div className="relative place-items-center">
                    <h2>{category} Done List</h2>
                        <ul className="place-items-center items-center self-center">
                            {doneListItems}
                        </ul>
                        <Link href={`/todos`}>
                            <button
                                // onClick={() => {let str = `/todo/${todoItem._id}`;router.push(str)}}
                                className="btn btn-primary"
                            >
                                To-Do List
                            </button>
                        </Link>
                        <Link href={`/todos/${category}`}>
                            <button
                                // onClick={() => {let str = `/todo/${todoItem._id}`;router.push(str)}}
                                className="btn btn-primary"
                            >
                                Category {category} To-Do List
                            </button>
                        </Link>
                    </div>
                </main>
            </>
        );
    }
}
