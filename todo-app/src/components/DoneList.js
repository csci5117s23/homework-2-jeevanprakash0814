import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { getDoneList, setToUndone } from "@/modules/data";

export default function DoneList() {
    const [doneItems, setDoneItems] = useState([]);
    const [removingDone, setRemovingDone] = useState(false);

    const { isLoaded, userId, getToken } = useAuth();

    useEffect(() => {
        async function process() {
            if(userId) {
                const token = await getToken({ template: "codehooks" })
                const res = await getDoneList(token,userId);
                return res;
            }
        }
        process().then((res) => {
            setDoneItems(res);
        });
    }, [isLoaded,removingDone])


    if(!isLoaded) {
        return <span> loading ... </span> // add nice loading animation here
    } else {
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
                <ul className="place-items-center items-center self-center">
                    {doneListItems}
                </ul>
            </>
        );
    }
}
