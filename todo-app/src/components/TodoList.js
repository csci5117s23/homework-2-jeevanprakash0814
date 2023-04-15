import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { addTodo, getTodoList, setToDone } from "@/modules/data";
import { useRouter } from "next/router";
import Link from "next/link";

export default function TodoList() {
    const [todoItems, setTodoItems] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [addingTodo, setAddingTodo] = useState(false);

    const { isLoaded, userId, getToken } = useAuth();

    const router = useRouter();

    useEffect(() => {
        async function process() {
            if(userId) {
                const token = await getToken({ template: "codehooks" })
                const res = await getTodoList(token,userId);
                return res;
            }
        }
        process().then((res) => {
            setTodoItems(res);
            setAddingTodo(false);
        });
    }, [isLoaded,addingTodo])

    async function add() {
        if(newTodo && userId) {
            var todoItem = {
                text: newTodo,
                category: "",
                userId: userId,
                completed: false
            };
            const token = await getToken({ template: "codehooks" })
            await addTodo(token,todoItem);
            // console.log("res" + JSON.stringify(res));
            // setTodoItems(res);
            // console.log(token);
            setNewTodo("");
            setAddingTodo(true);
        }
    }


    if(!isLoaded) {
        return <span> loading ... </span> // add nice loading animation here
    } else {
        const todoListItems = todoItems.map((todoItem) => (
            <li key={todoItem._id}>
                {todoItem.text}
                <Link href={`/todo/${todoItem._id}`}>
                    <button
                        // onClick={() => {let str = `/todo/${todoItem._id}`;router.push(str)}}
                        className="btn btn-success ml-5"
                    >
                        Open
                    </button>
                </Link>
                <button
                    onClick={async () => {
                        console.log("delete todo item!");
                        const token = await getToken({ template: "codehooks" });
                        await setToDone(token,userId,todoItem._id);
                        setAddingTodo(true);
                    }}
                    className="btn btn-info ml-5"
                >
                    Mark as Done
                </button>
            </li>
        ));

        return (
            <>
                <ul className="place-items-center items-center self-center">
                    {todoListItems}
                    <input
                        placeholder="add a new todo list item"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { add() } }}
                        autoFocus
                    ></input>
                    <button onClick={add} className="btn btn-secondary">add</button>
                </ul>
            </>
        );
    }
}