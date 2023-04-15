import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { getCategoryDoneList } from "@/modules/data";
import { useRouter } from "next/router";

export default function DoneCategoryPage() {
    const [doneItems, setDoneItems] = useState([]);

    const { isLoaded, userId, getToken } = useAuth();
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
    }, [isLoaded])

    if (!isLoaded) return <><span> loading ... </span></>;
    else if (isLoaded && !isSignedIn) router.push("/");
    else {
        const doneListItems = doneItems.map((doneItem) => (
            <li key={doneItem._id}>
                {doneItem.text}
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
                        <ul className="place-items-center items-center self-center">
                            {doneListItems}
                        </ul>
                    </div>
                </main>
            </>
        );
    }
}
