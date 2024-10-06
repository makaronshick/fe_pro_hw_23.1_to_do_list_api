export async function getAllTodos() {
    const resp = await fetch('/list');

    return await resp.json();
}

export async function addTodo(text) {
    const resp = await fetch('/list-item', {
        method: 'POST',
        body: text
    });

    return await resp.text();
}

export async function editTodo(id, text) {
    const resp = await fetch('/list-item/' + id, {
        method: 'PUT',
        body: text
    });

    return await resp.text();
}

export async function deleteTodo(id) {
    const resp = await fetch('/list-item/' + id, {
        method: 'DELETE'
    });

    return await resp.text();
}