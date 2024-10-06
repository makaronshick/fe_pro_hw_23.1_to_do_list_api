import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import Task from "./tasks.mjs";
import addTasks from "./addTasks.mjs";

import mongoose from "mongoose";

const dbUrl =
  "mongodb+srv://makaronshick:Z06rw9REhB27LFz8@clustermakaronshick.hjumu.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMakaronshick";
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", () => {
  console.log("DB error");
});
db.once("open", () => {
  console.log("DB opened");
});

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

const app = fastify();

let todoList = [];

app.register(fastifyStatic, {
  root: path.join(__dirname, "../client"),
});

app.get('/list', (req, res) => {
  return res.send(todoList);
});

app.post('/list-item', (req, res) => {
  const todoItem = {
    id: 'id' + Date.now(),
    text: req.body
  };

  todoList.push(todoItem);
  return res.send(todoItem.id);
});

app.put('/list-item/:id', (req, res) => {
  const { id } = req.params;
  const text = req.body;
  const todoItem = todoList.find(item => item.id === id);

  if (todoItem) {
    todoItem.text = text;
    return res.send(todoItem.id);
  }

  return res.status(400).send('Not found todo item ', id);
});

app.delete('/list-item/:id', (req, res) => {
  const { id } = req.params;
  const todoItem = todoList.find(item => item.id === id);

  if (todoItem) {
    todoList = todoList.filter(item => item.id !== id);
    return res.send(todoItem.id);
  }

  return res.status(400).send('Not found todo item ', id);
});



// app.get("/tasks", async (req, res) => {
//   try {
//     let tasks = await Task.find();
//     if (!tasks.length) {
//       await addTasks();
//       tasks = await Task.find();
//     }

//     res.send(tasks);
//   } catch (err) {
//     console.error("Cannot find tasks", err);
//     res.status(500).send("Something wrong");
//   }
// });

app.listen({ port: 5555 }, (err, adress) => {
  console.log("Fastify server started");
  console.log(adress);
});
