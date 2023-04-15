import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { addTodo, getTodoList, setToDone } from "@/modules/data";

export default function TodoList() {
    const [todoItems, setTodoItems] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [addingTodo, setAddingTodo] = useState(false);

    const { isLoaded, userId, sessionId, getToken } = useAuth();

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
            const res = await getTodoList(token,userId);
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
                <span
                    onClick={async () => {
                        console.log("delete todo item!");
                        const token = await getToken({ template: "codehooks" });
                        await setToDone(token,userId,todoItem._id);
                        setAddingTodo(true);
                    }}
                >
                    (x:{todoItem._id})
                </span>
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
                    ></input>
                    <button onClick={add} className="btn btn-secondary">add</button>
                </ul>
            </>
        );
    }
}