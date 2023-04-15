import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { editTodo, getTodo } from "@/modules/data";
import { useRouter } from "next/router";
import Link from "next/link";

export default function TodoFull({ id }) {
    const { isLoaded, userId, getToken } = useAuth();
    const [todoText, setTodoText] = useState("");
    const [editingTodo, setEditingTodo] = useState(false);

    const router = useRouter();

    useEffect(() => {
        async function process() {
            if(userId) {
                const token = await getToken({ template: "codehooks" })
                const res = (await getTodo(token,userId,id))[0];
                return res;
            }
        }
        process().then((res) => {
            setTodoText(res.text);
            console.log(todoText);
        }).catch(() => {
            router.push("/todos");
        });
    }, [isLoaded,!editingTodo])

    async function edit() {
        if(todoText && userId) {
            const token = await getToken({ template: "codehooks" })
            await editTodo(token,userId,id,todoText);
            // const res = (await getTodo(token,userId,id))[0];
            // console.log("res" + JSON.stringify(res));
            // setTodoText(res.text);
            setEditingTodo(false);
            // console.log(token);
        }
    }

    function toggleEdit() {
        setEditingTodo(true);
    }

    if (!isLoaded) {
        return <span> loading ... </span> // add nice loading animation here
    // } else if (!todoItems) router.push("/todos");
    } else {
        let cardFill = <span> loading ... </span>;
        if(editingTodo) {
            cardFill = (
                <div>
                    <input
                        value={todoText}
                        placeholder="Please fill in the desired to-do description"
                        onChange={(e) => setTodoText(e.target.value)}
                        autoFocus
                    ></input>
                    <button className="btn btn-primary" onClick={() => {edit()}}>Submit</button>
                </div>
            );
        } else {
            cardFill = (
                <div>
                    <h5 className="card-title">{todoText}</h5>
                    <button className="btn btn-primary" onClick={toggleEdit}>Edit</button>
                </div>
            )
        }
        return <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="card relative place-items-center">
                    <div className="card-body">
                        {cardFill}
                    </div>
                </div>
                <Link href={`/todos`}>
                    <button
                        // onClick={() => {let str = `/todo/${todoItem._id}`;router.push(str)}}
                        className="btn btn-primary"
                    >
                        Back to your To-Do List
                    </button>
                </Link>
            </main>
        </>
    }
}