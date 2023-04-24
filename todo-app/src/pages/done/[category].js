import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { getCategoryDoneList, setToUndone } from "@/modules/data";
import { useRouter } from "next/router";
import Head from 'next/head'
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { shrinkText } from "@/modules/utils";

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
        // const doneListItems = doneItems.map((doneItem) => (
        //     <li key={doneItem._id}>
        //         {shrinkText(doneItem.text)}
        //         <button
        //             onClick={async () => {
        //                 const token = await getToken({ template: "codehooks" });
        //                 await setToUndone(token,userId,doneItem._id);
        //                 setRemovingDone(true);
        //             }}
        //             className="btn btn-info ml-5"
        //         >
        //             Mark as Uncomplete
        //         </button>
        //     </li>
        // ));

        const doneListItems = doneItems.map((doneItem) => (
            <div className="card relative place-items-center p-3 m-3 shadow-lg">
                <h5 className="card-title"><s>{shrinkText(doneItem.text)}</s>{` ${new Date(doneItem.createdOn)}`}</h5>{/* Need to handle what happens if a huge piece of text is inputted */}

                <div className="card-body place-items-center">
                    <Link href={`/todo/${doneItem._id}`}>
                        <button
                            // onClick={() => {let str = `/todo/${todoItem._id}`;router.push(str)}}
                            className="btn btn-success ml-5"
                        >
                            Open
                        </button>
                    </Link>
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
                    <button
                        onClick={async () => {
                            const token = await getToken({ template: "codehooks" });
                            await deleteTodo(token,userId,doneItem._id).then(() => {
                                setRemovingDone(true);
                            }).catch((error) => {
                                console.log(error);
                            });
                        }}
                        className="btn btn-danger ml-5"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ));

        return (
            <>
                <Head>
                    <title>Done Category: {category}</title>
                    <meta name="description" content="To-Do List Category" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/pop_icon.png" />
                </Head>
                <Navbar />
                <main className="flex min-h-screen flex-col items-center justify-between p-24">
                    <div className="relative place-items-center">
                    <h2>{category} Done List</h2>
                        <ul className="place-items-center items-center self-center">
                            {doneListItems}{/* Need to handle what happens if a huge piece of text is inputted */}
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
