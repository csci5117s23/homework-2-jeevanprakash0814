import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { addTodo, getCategoryTodoList, setToDone } from "@/modules/data";
import { useRouter } from "next/router";
import Head from 'next/head'
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function TodoList() {
    const [todoItems, setTodoItems] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [addingTodo, setAddingTodo] = useState(false);

    const { isLoaded, userId, isSignedIn, getToken } = useAuth();
    const router = useRouter();

    const {category} = router.query;

    useEffect(() => {
        async function process() {
            if(userId) {
                const token = await getToken({ template: "codehooks" })
                const res = await getCategoryTodoList(token,userId,category);
                return res;
            }
        }
        process().then((res) => {
            console.log(res);
            setTodoItems(res);
            setAddingTodo(false);
        });
    }, [isLoaded,addingTodo])

    async function add() {
        if(newTodo && userId) {
            var todoItem = {
                text: newTodo,
                category: category,
                userId: userId,
                completed: false
            };
            const token = await getToken({ template: "codehooks" })
            await addTodo(token,todoItem);
            setNewTodo("");
            setAddingTodo(true);
        }
    }

    function shrinkText(text) {
        // if(text.length > innerWidth/20) return `${text.substring(0,innerWidth/20)}...`;
        // else return text;
        if(text.length > 20) return `${text.substring(0,20)}...`;
        else return text;
    }


    if (!isLoaded) return <><span> loading ... </span></>;
    else if (isLoaded && !isSignedIn) router.push("/");
    else if (!todoItems) router.push("/404");
    else {
        const todoListItems = todoItems.map((todoItem) => (
            <li key={todoItem._id}>
                {shrinkText(todoItem.text)}
                <button
                    onClick={async () => {
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
                <Head>
                    <title>To-Do Category: {category}</title>
                    <meta name="description" content="To-Do List Category" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/check_mark.ico" />
                </Head>
                <Navbar />
                <main className="flex min-h-screen flex-col items-center justify-between p-24">
                    <div className="relative place-items-center">
                        <h2>{category} Todo List</h2>
                        <ul className="place-items-center items-center self-center">
                            {todoListItems}
                            <input
                                placeholder="add a new todo list item"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { add() } }}
                                autoFocus
                            ></input>{/* Need to handle what happens if a huge piece of text is inputted */}
                            <button onClick={add} className="btn btn-secondary">add</button>
                        </ul>
                        <Link href={`/todos`}>
                            <button
                                // onClick={() => {let str = `/todo/${todoItem._id}`;router.push(str)}}
                                className="btn btn-primary"
                            >
                                Back to your To-Do List
                            </button>
                        </Link>
                        <Link href={`/done/${category}`}>
                            <button
                                // onClick={() => {let str = `/todo/${todoItem._id}`;router.push(str)}}
                                className="btn btn-primary"
                            >
                                Category {category} Completed Items
                            </button>
                        </Link>
                    </div>
                </main>
            </>
        );
    }
}