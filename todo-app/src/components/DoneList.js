import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { deleteTodo, getDoneList, setToUndone } from "@/modules/data";
import Link from "next/link";
import { shrinkText } from "@/modules/utils";

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
            setDoneItems(res.sort((a,b) => new Date(b.createdOn)-new Date(a.createdOn)));
        });
    }, [isLoaded,removingDone])

    if(!isLoaded) {
        return <span> loading ... </span> // add nice loading animation here
    } else {
        const doneListItems = doneItems.map((doneItem) => (
            <div className="card relative place-items-center p-3 m-3 shadow-lg">
                <h5 className="card-title"><s>{shrinkText(doneItem.text)}</s>{` ${new Date(doneItem.createdOn)}`}</h5>{/* Need to handle what happens if a huge piece of text is inputted */}

                <div className="card-body place-items-center">
                    {doneItem.category === "" ? <></> : 
                        <div className="card-body place-items-center">
                            Category:
                            <Link href={`done/${doneItem.category}`}>
                                <span className="badge rounded-pill bg-dark text-light">{doneItem.category}</span>
                            </Link>
                            <br></br>
                        </div>
                    }
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
                <ul className="place-items-center items-center self-center">
                    {doneListItems}
                </ul>
            </>
        );
    }
}
