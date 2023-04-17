import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { addCategory, addTodo, deleteCategory, deleteTodo, editTodoCategory, getCategories, getCategoryAllList, getCategoryTodoList, getTodoList, setToDone } from "@/modules/data";
import { useRouter } from "next/router";
import Link from "next/link";

export default function TodoList() {
    const [todoItems, setTodoItems] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [addingTodo, setAddingTodo] = useState(false);
    const [categories, setCategories] = useState([]);
    const [addingCategory, setAddingCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");

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
            setTodoItems(res.sort((a,b) => new Date(b.createdOn)-new Date(a.createdOn)));
            setAddingTodo(false);
        });
    }, [isLoaded,addingTodo])

    useEffect(() => {
        async function processCategories() {
            if(userId) {
                const token = await getToken({ template: "codehooks" })
                const res = await getCategories(token,userId);
                return res;
            }
        }
        processCategories().then((res) => {
            setCategories(res);
            // console.log(res);
            // console.log("I am here 3: ");
            // console.log(categories);
            setAddingCategory(false);
        })
    }, [isLoaded,addingCategory])

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

    async function addCategoryItem() { // TODO: need to handle adding duplicate category item
        if(newCategory && userId) {
            // console.log("I am here");
            var categoryItem = {
                name: newCategory,
                userId: userId
            };
            const token = await getToken({ template: "codehooks" })
            await addCategory(token,categoryItem);
            // console.log("res" + JSON.stringify(res));
            // setTodoItems(res);
            // console.log(token);
            setNewCategory("");
            setAddingCategory(true);
        }
    }

    async function deleteCategoryOption(category) {
        const token = await getToken({ template: "codehooks" });
        deleteCategory(token,userId,category._id).then(() => {
            setAddingCategory(true);
        }).catch((error) => {
            console.log(error);
        })
        getCategoryAllList(token,userId,category.name).then((res) => {
            res.forEach(async (todoItem) => {
                await editTodoCategory(token,userId,todoItem._id,"");
            });
        })
    }


    if(!isLoaded) {
        return <span> loading ... </span> // add nice loading animation here
    } else {
        const todoListItems = todoItems.map((todoItem) => (
            <li key={todoItem._id}>
                {todoItem.text}{` ${new Date(todoItem.createdOn)}`}
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
                        const token = await getToken({ template: "codehooks" });
                        await setToDone(token,userId,todoItem._id);
                        setAddingTodo(true);
                    }}
                    className="btn btn-info ml-5"
                >
                    Mark as Done
                </button>
                <button
                    onClick={async () => {
                        const token = await getToken({ template: "codehooks" });
                        await deleteTodo(token,userId,todoItem._id).then(() => {
                            setAddingTodo(true);
                        }).catch((error) => {
                            console.log(error);
                        });
                    }}
                    className="btn btn-danger ml-5"
                >
                    Delete
                </button>
            </li>
        ));

        const categoryItems = categories.map((category) => (
            <li key={category._id}>
                {category.name}
                <Link href={`/todos/${category.name}`}>
                    <button className="btn btn-success">
                        Open
                    </button>
                </Link>
                <button
                    onClick={async () => {
                        await deleteCategoryOption(category);
                    }}
                    className="btn btn-danger ml-5"
                >
                    Delete
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
                <ul className="place-items-center items-center self-center">
                    {categoryItems}
                    <input
                        placeholder="add a new category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { addCategoryItem() } }}
                    ></input>
                    <button onClick={addCategoryItem} className="btn btn-secondary">add</button>
                </ul>
            </>
        );
    }
}