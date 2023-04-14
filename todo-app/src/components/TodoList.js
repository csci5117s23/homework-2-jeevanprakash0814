import React, { useState, useEffect } from "react";
import { useAuth, UserButton, SignIn } from '@clerk/nextjs';
import { addTodo, getTodoList } from "@/modules/data";

export default function TodoList() {
    const [loading, setLoading] = useState(false);
    const [todoItems, setTodoItems] = useState([]);
    const [newTodo, setNewTodo] = useState("");

    const { isLoaded, userId, sessionId, getToken } = useAuth();


    // setLoading(true);

    // useEffect(() => {
    //     async function getTodoList() {
    //         if(userId) {
    //             // setTodoItems(await getTodoList(getToken({ template: "codehooks" })));
    //             console.log(await getTodoList(getToken({ template: "codehooks" })))
    //         }
    //     }
    //     getTodoList();
    // }, [isLoaded])

    async function add() {
        if(newTodo && userId) {
            var todoItem = {
                id: 1,
                text: newTodo,
                category: "",
                userId: userId,
            };
            const res = await getTodoList(getToken({ template: "codehooks" }));
            console.log(res);
            setTodoItems(todoItems.concat(todoItem));
            console.log(getToken({ template: "codehooks" }));
            addTodo(getToken({ template: "codehooks" }),newTodo);
            setNewTodo("");
        }
    }


    if(!isLoaded) {
        return <span> loading ... </span> // add nice loading animation here
    } else {
        const todoListItems = todoItems.map((todoItem) => (
            <li key={todoItem.text}>
                {todoItem.text}
                <span
                    onClick={() => {
                        console.log("delete todo item!");
                    }}
                >
                    (x)
                </span>
            </li>
        ));

        return (
            <>
                <ol className="place-items-center items-center self-center">
                    {todoListItems}
                    <input
                        placeholder="add a new todo list item"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { add() } }}
                    ></input>
                    <button onClick={add} className="btn btn-secondary">add</button>
                </ol>
            </>
        );
    }
}