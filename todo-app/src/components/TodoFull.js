import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { addCategory, editTodoCategory, editTodoText, getCategories, getTodo } from "@/modules/data";
import { useRouter } from "next/router";
import Link from "next/link";

export default function TodoFull({ id }) {
    const { isLoaded, userId, getToken } = useAuth();
    const [todoText, setTodoText] = useState("");
    const [editingTodo, setEditingTodo] = useState(false);
    const [todoCategory, setTodoCategory] = useState("");
    const [editingCategory, setEditingCategory] = useState(false);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [completed, setCompleted] = useState(false);
    
    const router = useRouter();

    // for editing todo text
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
            setCompleted(res.completed);
            // console.log(todoText);
        }).catch(() => {
            router.push("/404"); // check to make sure that the user doesn't access a non-existent todo id or one that they don't have access to
        });
    }, [isLoaded,!editingTodo])

    // for getting categories
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
            // console.log(todoText);
        }).catch(() => {
            setCategories([]); // check to make sure that the user doesn't access a non-existent categories
        });
    }, [isLoaded,editingCategory])

    // for updating current category
    useEffect(() => {
        async function process() {
            if(userId) {
                const token = await getToken({ template: "codehooks" })
                const res = (await getTodo(token,userId,id))[0];
                return res;
            }
        }
        process().then((res) => {
            setTodoCategory(res.category);
            // console.log(todoText);
        }).catch(() => {
            router.push("/404"); // check to make sure that the user doesn't access a non-existent todo id or one that they don't have access to
        });
    }, [!editingCategory])


    async function editText() {
        if(todoText && userId) {
            const token = await getToken({ template: "codehooks" })
            await editTodoText(token,userId,id,todoText);
            // const res = (await getTodo(token,userId,id))[0];
            // console.log("res" + JSON.stringify(res));
            // setTodoText(res.text);
            setEditingTodo(false);
            // console.log(token);
        }
    }

    async function editCategory(categoryName,addingNewCategory) {
        if(categoryName && categoryName.length > 0 && userId) {
            const token = await getToken({ template: "codehooks" })
            await editTodoCategory(token,userId,id,categoryName);
            // console.log(`outside ${newCategory} ${addingNewCategory}`);
            if(newCategory && newCategory.length > 0 && addingNewCategory) {
                // console.log("Inside");
                const categoryItem = {
                    userId: userId,
                    name: newCategory
                }
                await addCategory(token,categoryItem);
                setNewCategory("");
                setCategories(await getCategories(token,userId));
            } // need an else statement here
            // const res = (await getTodo(token,userId,id))[0];
            // console.log("res" + JSON.stringify(res));
            // setTodoText(res.text);
            // setEditingTodo(false);
            setEditingCategory(false);
            // console.log(token);
        }
    }    

    function toggleEditCategory() {
        setEditingCategory(true);
    }

    function addingNewCategoryHelper() {
        editCategory(newCategory,true);
    }

    if (!isLoaded) {
        return <span> loading ... </span> // add nice loading animation here
    // } else if (!todoItems) router.push("/todos");
    } else {
        let cardFill = <span> loading ... </span>;
        let categoryItems = <span className="badge rounded-pill bg-danger"> No categories available at this time! </span>;

        if(categories && categories.length > 0) {
            categoryItems = categories.map((category) => (
                    <button className="badge rounded-pill bg-dark text-light m-1" onClick={() => {editCategory(category.name)}}>{category.name}</button>
            ));
        }


        if(editingTodo && editingCategory) {
            setEditingTodo(false);
            setEditingCategory(false);
        } else if(editingTodo) {
            cardFill = (
                <div className="d-inline-flex flex-column">
                    <span>Enter New Text: </span>
                    <textarea
                        value={todoText}
                        placeholder="Please fill in the desired to-do description"
                        onChange={(e) => setTodoText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { editText } }}
                        className="border border-dark form-control p-2"
                    ></textarea>
                    {!completed ?
                    <Link href={`/todos/${todoCategory}`}>
                        <span className="badge rounded-pill bg-dark text-light m-2">{todoCategory}</span>
                    </Link>
                    :
                    <Link href={`/done/${todoCategory}`}>
                        <span className="badge rounded-pill bg-dark text-light m-2">{todoCategory}</span>
                    </Link>}
                    <div className="btn-group" role="group">
                        <button className="btn btn-success m-1 rounded" onClick={editText}>Submit</button>
                        <button className="btn btn-danger m-1 rounded" onClick={() => setEditingTodo(false)}>Cancel</button>
                    </div>
                </div>
            );
        } else if(editingCategory) {
            cardFill = (
                <div className="d-inline-flex flex-column">
                    <h5 className="card-title">{todoText}</h5>
                    <span>Choose a Category: </span>
                    {categoryItems}
                    <span>Or Enter a New Category: </span>
                    <textarea
                        value={newCategory}
                        placeholder="Please fill in the desired category name"
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { addingNewCategoryHelper() } }}
                        className="border border-dark form-control"
                    ></textarea>
                    <div className="btn-group" role="group">
                        <button className="btn btn-success m-1 rounded" onClick={addingNewCategoryHelper}>Submit</button>
                        <button className="btn btn-danger m-1 rounded" onClick={() => setEditingCategory(false)}>Cancel</button>
                    </div>
                </div>
                
            );
        } else {
            console.log(todoCategory);
            cardFill = (
                <div className="d-inline-flex flex-column">
                    <h5 className="card-title m-2">Full Todo Description</h5>
                    <textarea
                        value={todoText}
                        className="p-2"
                        disabled
                    ></textarea>
                    {!completed ?
                    <Link href={`/todos/${todoCategory}`}>
                        <span className="badge rounded-pill bg-dark text-light m-2">{todoCategory}</span>
                    </Link>
                    :
                    <Link href={`/done/${todoCategory}`}>
                        <span className="badge rounded-pill bg-dark text-light m-2">{todoCategory}</span>
                    </Link>}
                    <div className="btn-group" role="group">
                        <button className="btn btn-warning m-1 rounded" onClick={() => setEditingTodo(true)}>Edit Text</button>
                        <button className="btn btn-warning m-1 rounded" onClick={toggleEditCategory}>Edit Category</button>
                    </div>
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
                        To-Do List
                    </button>
                </Link>
                <Link href={`/done`}>
                    <button
                        // onClick={() => {let str = `/todo/${todoItem._id}`;router.push(str)}}
                        className="btn btn-primary"
                    >
                        Completed Items
                    </button>
                </Link>
            </main>
        </>
    }
}