'use strict';
import { getAllTodos, addTodo, editTodo, deleteTodo } from './api.js';
console.log("CLIENT");

const todoInputEl = document.querySelector(".todo-input");
const addBtnEl = document.querySelector(".add-btn");

const todoListEl = document.querySelector(".todo-list");
let todoList = [];

getAllTodos()
  .then(list => {
    todoList.push(...list);
    todoList.forEach(todo => {
      createTodoItem(todo, todoListEl);
    })
  });

function createTodoItem({text, id}, parent) {
  const itemEl = document.createElement("li");
  itemEl.className = "todo-list-item";
  // const id = 'id' + Date.now();
  itemEl.id = id;
  itemEl.innerHTML = `<span class="todo-list-item-text">${text}</span>
    <button class="form-btn edit-btn">Edit</button>
    <button class="form-btn delete-btn">Delete</button>`;

  // todoList.push({ id, text });  
  parent.append(itemEl);
}

addBtnEl.addEventListener("click", async () => {
  const newTaskText = todoInputEl.value.trim();
  if (!newTaskText) {
    return;
  }

  const id = await addTodo(newTaskText);
  const newTask = { id, text: newTaskText };
  todoList.push(newTask);

  createTodoItem(newTask, todoListEl);
  todoInputEl.value = "";
});

todoListEl.addEventListener("click", async (event) => {
  event.stopPropagation();
  const { target } = event;
  const todoItemEl = target.closest(".todo-list-item");
  const todoItem = todoList.find(task => task.id === todoItemEl.id);
  
  if (target.classList.contains("delete-btn")) {
    const taskText = todoItemEl.querySelector(".todo-list-item-text").textContent;

    if (confirm(`Are you sure to delete: ${taskText} ?`)) {
      await deleteTodo(todoItemEl.id);
      todoItemEl.remove();
      todoList = todoList.filter(task => task.id !== todoItemEl.id);
    }
  }

  if (target.classList.contains("edit-btn")) {
    // console.log("edit");
    const taskText = todoItemEl.querySelector(".todo-list-item-text").textContent;
    todoItemEl.innerHTML = `<input class="todo-list-item-text" value="${taskText}" defaultValue=${taskText}/>
    <button class="form-btn save-btn">Save</button>
    <button class="form-btn cancel-btn">Cancel</button>`;
  }

  if (target.classList.contains("save-btn")) {
    // console.log("save");
    const updatedTaskText = target.previousElementSibling.value.trim();
    if (!updatedTaskText) {
      return;
    }

    await editTodo(todoItemEl.id, updatedTaskText);
    todoItem.text = updatedTaskText;
    todoItemEl.innerHTML = `<span class="todo-list-item-text">${updatedTaskText}</span>
    <button class="form-btn edit-btn">Edit</button>
    <button class="form-btn delete-btn">Delete</button>`;
  }

  if (target.classList.contains("cancel-btn")) {
    console.log("cancel");
    // const oldTaskText = target.previousElementSibling.previousElementSibling.defaultValue;

    todoItemEl.innerHTML = `<span class="todo-list-item-text">${todoItem.text}</span>
    <button class="form-btn edit-btn">Edit</button>
    <button class="form-btn delete-btn">Delete</button>`;
  }
});

// fetch('/tasks')
//   .then(response => response.json())
//   .then(tasks => {
//     tasks.forEach(t => {
//         const taskElement = document.createElement('div');
//         taskElement.textContent = 'Task: ' + t.content;
//         document.body.append(taskElement);
//     });
//   })
