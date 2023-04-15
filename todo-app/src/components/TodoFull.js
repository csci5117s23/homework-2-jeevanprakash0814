import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { editTodo, getTodo } from "@/modules/data";

export default function TodoFull({ id }) {
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [todoText, setTodoText] = useState("");
    const [editingTodo, setEditingTodo] = useState(false);
    const [editingComplete, setEditingComplete] = useState(false);

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
            setEditingComplete(false);
        });
    }, [isLoaded,editingComplete])

    async function edit() {
        if(newTodo && userId) {
            var todoItem = {
                text: newTodo,
                category: "",
                userId: userId,
                completed: false
            };
            const token = await getToken({ template: "codehooks" })
            await editTodo(token,userId,id,todoText);
            const res = (await getTodo(token,userId,id))[0];
            // console.log("res" + JSON.stringify(res));
            setTodoText(res.text);
            // console.log(token);
            setNewTodo("");
        }
    }

    if (!isLoaded) {
        return <span> loading ... </span> // add nice loading animation here
    } else {
        return <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="card relative place-items-center">
                    <div className="card-body">
                        {editingTodo ? (
                            <div>
                                <input
                                    value={todoText}
                                    placeholder="Please fill in the desired to-do description"
                                    onChange={(e) => setTodoText(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { edit() } }}
                                ></input>
                                <button className="btn btn-primary" onClick={() => {edit();setEditingTodo(false);setEditingComplete(true)}}>Submit</button>
                            </div>
                        ) : (
                            <div>
                                <h5 className="card-title">{todoText}</h5>
                                <button className="btn btn-primary" onClick={setEditingTodo(true)}>Edit</button>
                            </div>
                        )
                        }
                    </div>
                </div>
            </main>
        </>
    }
}