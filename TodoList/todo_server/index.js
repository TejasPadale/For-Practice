const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TodoModel = require("./Models/Todo");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/todo_app")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* ============================
   ADD TASK
============================ */
app.post("/add", async (req, res) => {
  try {
    const { task } = req.body;
    if (!task || !task.trim()) {
      return res.status(400).json({ message: "Task is required" });
    }

    // auto-increment order
    const lastTodo = await TodoModel.findOne().sort({ order: -1 });
    const nextOrder = lastTodo ? lastTodo.order + 1 : 1;

    const todo = await TodoModel.create({
      task,
      order: nextOrder,
    });

    return res.status(201).json(todo);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ============================
   GET TASKS (ORDERED)
============================ */
app.get("/get", async (req, res) => {
  try {
    const todos = await TodoModel.find().sort({ order: 1 });
    return res.json(todos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ============================
   TOGGLE COMPLETE / INCOMPLETE
============================ */
app.put("/toggle/:id", async (req, res) => {
  try {
    const todo = await TodoModel.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.completed = !todo.completed;
    await todo.save();

    return res.json(todo);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ============================
   EDIT TASK
============================ */
app.put("/edit/:id", async (req, res) => {
  try {
    const { task } = req.body;
    if (!task || !task.trim()) {
      return res.status(400).json({ message: "Task is required" });
    }

    const updated = await TodoModel.findByIdAndUpdate(
      req.params.id,
      { task },
      { new: true }
    );

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ============================
   DELETE TASK
============================ */
app.delete("/delete/:id", async (req, res) => {
  try {
    await TodoModel.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ============================
   REORDER TASKS (DRAG & DROP)
============================ */
app.put("/reorder", async (req, res) => {
  try {
    const { todos } = req.body; // [{ _id, order }]

    if (!Array.isArray(todos)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const bulkOps = todos.map((todo) => ({
      updateOne: {
        filter: { _id: todo._id },
        update: { order: todo.order },
      },
    }));

    await TodoModel.bulkWrite(bulkOps);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ============================
   SERVER
============================ */
app.listen(3001, () => {
  console.log("Server running on port 3001");
});
