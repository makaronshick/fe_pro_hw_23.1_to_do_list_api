import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config.js";
import Task from "./tasks.mjs";
import { ObjectId } from "mongodb";

import mongoose from "mongoose";

const dbUrl = process.env.MONGO_URL;
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

app.register(fastifyStatic, {
  root: path.join(__dirname, "../client"),
});

app.get("/list", (req, res) => {
  Task.find()
    .then((tasks) => res.send(tasks))
    .catch((err) => {
      console.error("Cannot find tasks", err);
      throw err;
    });
});

app.post("/list-item", (req, res) => {
  const todoItemEntry = new Task({
    text: req.body,
  });

  todoItemEntry
    .save()
    .then((task) => {
      console.log("New task saved", task);
      return res.send(todoItemEntry._id);
    })
    .catch((err) => {
      console.error("Cannot save task", err);
      throw err;
    });
});

app.put("/list-item/:id", (req, res) => {
  const { id } = req.params;
  const text = req.body;
  Task.updateOne(
    { _id: ObjectId.createFromHexString(id) },
    { $set: { text: text } }
  )
    .then((task) => {
      console.log("Task edited", task);
      return res.send(id);
    })
    .catch((err) => {
      console.error("Cannot edit task", err);
      throw err;
    });
});

app.delete("/list-item/:id", (req, res) => {
  const { id } = req.params;
  Task.deleteOne(
    { _id: ObjectId.createFromHexString(id) }
  )
    .then((task) => {
      console.log("Task deleted", task);
      return res.send(id);
    })
    .catch((err) => {
      console.error("Cannot delete task", err);
      throw err;
    });
});

app.listen(
  { port: process.env.PORT, host: process.env.HOST },
  (err, adress) => {
    console.log("Fastify server started");
    console.log(adress);
  }
);
