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
            const categoryList = await getCategories(token,userId);
            console.log(categoryList);
            if(!categoryList.reduce((acc,curr) => acc || (curr.name===newCategory),false)) {
                await addCategory(token,categoryItem);
                setNewCategory("");
                setAddingCategory(true);
            } else {
                alert("Please enter a unique category name");
            }
            // console.log("res" + JSON.stringify(res));
            // setTodoItems(res);
            // console.log(token);
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

    function shrinkText(text) {
        // if(text.length > screen.width/20) return `${text.substring(0,screen.width/20)}...`;
        // else return text;
        if(text.length > 20) return `${text.substring(0,20)}...`;
        else return text;
    }


    if(!isLoaded) {
        return <span> loading ... </span> // add nice loading animation here
    } else {
        const todoListItems = todoItems.map((todoItem) => (
            <div className="card relative place-items-center p-3 m-3 shadow-lg">
                <h5 className="card-title">{shrinkText(todoItem.text)}{` ${new Date(todoItem.createdOn)}`}</h5>
                <div className="card-body">
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
                </div>
            </div>
            // <li key={todoItem._id}>
            // </li>
        ));

        const categoryItems = categories.map((category) => (
            <div className="card relative place-items-center p-3 m-3 shadow-lg">
                {/* <span class="badge rounded-pill bg-primary"><Link href={`/todos/${category.name}`}><span>{category.name}</span></Link> <span onClick={async () => {
                    await deleteCategoryOption(category);
                }}>x</span>
                </span> */}
                <div className="btn-group" role="group">
                    <Link href={`/todos/${category.name}`}><button type="button" className="btn btn-primary m-1 rounded">{category.name}</button></Link>
                    <button type="button" className="btn btn-danger m-1 rounded" onClick={async () => {
                    await deleteCategoryOption(category);
                }}>Delete</button>
                </div>
                {/* <button
                    onClick={async () => {
                        await deleteCategoryOption(category);
                    }}
                    className="badge rounded btn-danger ml-5"
                >
                    x
                </button> */}
            </div>
            // <li key={category._id}>
            // </li>
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
                        className="border border-dark form-control"
                    ></input> {/* Need to handle what happens if a huge piece of text is inputted */}
                    <button onClick={add} className="btn btn-secondary">add</button>
                </ul>
                <ul className="place-items-center items-center self-center">
                    {categoryItems}
                    <input
                        placeholder="add a new category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { addCategoryItem() } }}
                        className="border border-dark form-control"
                    ></input>
                    <button onClick={addCategoryItem} className="btn btn-secondary">add</button>
                </ul>
            </>
        );
    }
}