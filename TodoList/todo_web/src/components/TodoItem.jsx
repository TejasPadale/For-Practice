import React, { useEffect, useState } from "react";
import axios from "axios";

function TodoItem({ todo, refreshTodos }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTask, setNewTask] = useState(todo.task);
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 Keep local edit state in sync with props
  useEffect(() => {
    setNewTask(todo.task);
  }, [todo.task]);

  const toggleStatus = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await axios.put(`http://localhost:3001/toggle/${todo._id}`);
      refreshTodos();
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await axios.delete(`http://localhost:3001/delete/${todo._id}`);
      refreshTodos();
    } finally {
      setIsLoading(false);
    }
  };

  const saveEdit = async () => {
    if (!newTask.trim() || isLoading) return;
    setIsLoading(true);

    try {
      await axios.put(`http://localhost:3001/edit/${todo._id}`, {
        task: newTask.trim(),
      });
      setIsEditing(false);
      refreshTodos();
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setNewTask(todo.task);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border shadow-sm transition
        ${
          todo.completed ? "bg-gray-100 text-gray-400 line-through" : "bg-white"
        }
        ${isLoading ? "opacity-60 pointer-events-none" : ""}
      `}
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={toggleStatus}
          aria-label="Mark task completed"
          className="w-5 h-5 accent-indigo-500 cursor-pointer"
        />

        {isEditing ? (
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") cancelEdit();
            }}
            autoFocus
            className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        ) : (
          <span className="flex-1 select-none">{todo.task}</span>
        )}
      </div>

      {/* RIGHT SIDE ACTIONS */}
      <div className="flex gap-2 ml-3">
        {isEditing ? (
          <>
            {/* SAVE */}
            <button
              onClick={saveEdit}
              aria-label="Save task"
              className="
          relative group
          text-indigo-600 font-medium
          transition-all duration-200 ease-out
          motion-safe:hover:scale-110
          active:scale-95
        "
            >
              Save
              <span
                className="
            absolute -top-8 left-1/2 -translate-x-1/2
            whitespace-nowrap
            rounded-md bg-indigo-600 px-2 py-1 text-xs text-white
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            pointer-events-none
          "
              >
                Save changes
              </span>
            </button>

            {/* CANCEL */}
            <button
              onClick={cancelEdit}
              aria-label="Cancel edit"
              className="
          relative group
          text-gray-500
          transition-all duration-200 ease-out
          motion-safe:hover:scale-110
          active:scale-95
        "
            >
              Cancel
              <span
                className="
            absolute -top-8 left-1/2 -translate-x-1/2
            whitespace-nowrap
            rounded-md bg-gray-700 px-2 py-1 text-xs text-white
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            pointer-events-none
          "
              >
                Cancel edit
              </span>
            </button>
          </>
        ) : (
          /* EDIT */
          <button
            onClick={() => setIsEditing(true)}
            aria-label="Edit task"
            className="
        relative group
        text-gray-500 hover:text-indigo-600
        transition-all duration-200 ease-out
        motion-safe:hover:scale-110
        motion-safe:hover:-rotate-3
        active:scale-95
      "
          >
            ✏️
            <span
              className="
          absolute -top-8 left-1/2 -translate-x-1/2
          whitespace-nowrap
          rounded-md bg-gray-800 px-2 py-1 text-xs text-white
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          pointer-events-none
        "
            >
              Edit
            </span>
          </button>
        )}

        {/* DELETE */}
        <button
          onClick={deleteTask}
          aria-label="Delete task"
          className="
      relative group
      text-red-500 hover:text-red-600
      transition-all duration-200 ease-out
      motion-safe:hover:scale-110
      motion-safe:hover:rotate-3
      active:scale-95
    "
        >
          🗑
          <span
            className="
        absolute -top-8 left-1/2 -translate-x-1/2
        whitespace-nowrap
        rounded-md bg-red-600 px-2 py-1 text-xs text-white
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        pointer-events-none
      "
          >
            Delete
          </span>
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
