// all code here is referenced from Professor Kluver's index.js backend folder example

const backend_base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getTodoList(authToken) {
    const result = await fetch(backend_base+"/todos",{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function addTodo(authToken, todo) {
    // console.log(JSON.stringify(todo));
    const result = await fetch(`${backend_base}/todos`, {
        'method': 'POST',
        'headers': {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(todo)
    })
    return result;
}

export async function deleteTodo(authToken, todo) {
    const result = await fetch(backend_base+"/todo/"+todo.id,{
        'method':'DELETE',
        'headers': {'Authorization': 'Bearer ' + authToken},
    })
    return await result.json();
}

export async function addDone(authToken, todo) {
    const result = await fetch(backend_base + "/done", {
        'method': 'POST',
        'headers': {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify({
            id: todo.id,
            text: todo.text,
            category: todo.category,
            userId: authToken.sub,
            completed: true
        })
    })
    return await result.json();
}

export async function getCategories (authToken) {
    const result = await fetch(backend_base+"/pres",{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}