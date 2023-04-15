// all code here is referenced from Professor Kluver's index.js backend folder example

const backend_base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getTodoList(authToken, userId) {
    const result = await fetch(`${backend_base}/todos?userId=${userId}&completed=false`,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function getDoneList(authToken, userId) {
    const result = await fetch(`${backend_base}/todos?userId=${userId}&completed=true`,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function getAllTodoList(authToken, userId) {
    const result = await fetch(`${backend_base}/todos?userId=${userId}`,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function getCategoryTodoList(authToken, userId, category) {
    const result = await fetch(`${backend_base}/todos?userId=${userId}&completed=false&category=${category}`,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function getCategoryDoneList(authToken, userId, category) {
    const result = await fetch(`${backend_base}/todos?userId=${userId}&completed=true&category=${category}`,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function getTodo(authToken, userId, todoId) {
    const result = await fetch(`${backend_base}/todos?userId=${userId}&_id=${todoId}`,{
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

export async function setToDone(authToken, userId, todoId) {
    let todoItem = (await getTodo(authToken, userId, todoId))[0];
    todoItem.completed = true;
    const result = fetch(`${backend_base}/updateTodo?userId=${userId}&_id=${todoId}`, {
        'method': 'PUT',
        'headers': {
          'Authorization': 'Bearer ' + authToken,
          'Content-Type': 'application/json',
        },
        'body': JSON.stringify(todoItem)
      });
      return result;
}

export async function editTodo(authToken, userId, todoId, text) {
    let todoItem = (await getTodo(authToken, userId, todoId))[0];
    todoItem.text = text;
    const result = fetch(`${backend_base}/updateTodo?userId=${userId}&_id=${todoId}`, {
        'method': 'PUT',
        'headers': {
          'Authorization': 'Bearer ' + authToken,
          'Content-Type': 'application/json',
        },
        'body': JSON.stringify(todoItem)
      });
      return result;
}