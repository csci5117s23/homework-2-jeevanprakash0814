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
    const [submitCategory, setSubmitCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    
    const router = useRouter();
    
    // useEffect for setting the category list
    // useEffect(() => {
    //     async function processCategories() {
    //         if(userId) {
    //             const token = await getToken({ template: "codehooks" })
    //             const res = await getCategories(token,userId);
    //             return res;
    //         }
    //     }
    //     processCategories().then((res) => {
    //         setCategories(res);
    //         // console.log(res);
    //         // console.log("I am here 3: ");
    //         // console.log(categories);
    //     }).catch(() => {
    //         setCategories([]); // need this type of error check everywhere
    //     })
    // }, [isLoaded])

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
        // }).catch(() => {
        //     setCategories([]); // need this type of error check everywhere
        // })
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
            setEditingCategory(false);
            setSubmitCategory(false);
        }).catch(() => {
            router.push("/404"); // check to make sure that the user doesn't access a non-existent todo id or one that they don't have access to
        });
    }, [submitCategory])


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
            console.log(`outside ${newCategory} ${addingNewCategory}`);
            if(newCategory && newCategory.length > 0 && addingNewCategory) {
                console.log("Inside");
                const categoryItem = {
                    userId: userId,
                    name: newCategory
                }
                await addCategory(token,categoryItem);
                setNewCategory("");
                setCategories(await getCategories(token,userId));
            }
            // const res = (await getTodo(token,userId,id))[0];
            // console.log("res" + JSON.stringify(res));
            // setTodoText(res.text);
            // setEditingTodo(false);
            setSubmitCategory(true);
            // console.log(token);
        }
    }    

    function toggleEditText() {
        setEditingTodo(true);
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
                    <button className="badge rounded-pill bg-dark text-light" onClick={() => {editCategory(category.name)}}>{category.name}</button>
            ));
        }


        if(editingTodo && editingCategory) {
            cardFill = (
                <div>
                    <span>Enter New Text: </span>
                    <input
                        value={todoText}
                        placeholder="Please fill in the desired to-do description"
                        onChange={(e) => setTodoText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { editText } }}
                        autoFocus
                    ></input>
                    <button className="btn btn-primary" onClick={editText}>Submit Edit</button>
                    <span>Choose a New Category: </span>
                    {categoryItems}
                    <span>Or Enter a New Category: </span>
                    <input
                        value={newCategory}
                        placeholder="Please fill in the desired category name"
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { addingNewCategoryHelper() } }}
                        autoFocus
                    ></input>
                    <button className="btn btn-primary" onClick={addingNewCategoryHelper}>Submit</button>
                </div>
            );
        } else if(editingTodo) {
            cardFill = (
                <div>
                    <span>Enter New Text: </span>
                    <input
                        value={todoText}
                        placeholder="Please fill in the desired to-do description"
                        onChange={(e) => setTodoText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { editText } }}
                        autoFocus
                    ></input>
                    <span className="badge rounded-pill bg-light text-dark">{todoCategory}</span>
                    <button className="btn btn-primary" onClick={editText}>Submit</button>
                </div>
            );
        } else if(editingCategory) {
            cardFill = (
                <div>
                    <h5 className="card-title">{todoText}</h5>
                    <button className="btn btn-primary" onClick={toggleEditText}>Edit Text</button>
                    <span>Choose a Category: </span>
                    {categoryItems}
                    <span>Or Enter a New Category: </span>
                    <input
                        value={newCategory}
                        placeholder="Please fill in the desired category name"
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { addingNewCategoryHelper() } }}
                        autoFocus
                    ></input>
                    <button className="btn btn-primary" onClick={addingNewCategoryHelper}>Submit</button>
                </div>
                
            );
        } else {
            console.log(todoCategory);
            cardFill = (
                <div>
                    <h5 className="card-title">{todoText}</h5>
                    <span className="badge rounded-pill bg-dark text-light">{todoCategory}</span>
                    <button className="btn btn-primary" onClick={toggleEditText}>Edit Text</button>
                    <button className="btn btn-primary" onClick={toggleEditCategory}>Edit Category</button>
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