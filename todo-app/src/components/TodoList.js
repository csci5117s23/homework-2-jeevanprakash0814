import React, { useState, useEffect } from "react";

export default function TodoList() {
    const [loading, setLoading] = useState(false);
    const [todoItems, setTodoItems] = useState([]);

    const [newTodo, setNewTodo] = useState("");


    // setLoading(true);

    function add() {
        var todoItem = { text: newTodo };
        setTodoItems(todoItems.concat(todoItem));
        setNewTodo("");
    }


    if(loading) {
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
                <ol>
                    {todoListItems}
                    <input
                        placeholder="add a new todo list item"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { add() } }}
                    ></input>
                    <button onClick={add}>add</button>
                </ol>
            </>
        );
    }
}