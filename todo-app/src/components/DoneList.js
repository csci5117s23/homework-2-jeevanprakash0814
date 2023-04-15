import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { getDoneList } from "@/modules/data";

export default function DoneList() {
    const [doneItems, setDoneItems] = useState([]);

    const { isLoaded, userId, sessionId, getToken } = useAuth();

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
    }, [isLoaded])


    if(!isLoaded) {
        return <span> loading ... </span> // add nice loading animation here
    } else {
        const doneListItems = doneItems.map((doneItem) => (
            <li key={doneItem._id}>
                {doneItem.text}
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
