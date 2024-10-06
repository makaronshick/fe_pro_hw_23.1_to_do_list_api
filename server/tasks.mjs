import mongoose from "mongoose";

const { Schema, model } = mongoose;

const taskSchema = new Schema({
  content: String,
});

const Task = model("Task", taskSchema);

export default Task;
