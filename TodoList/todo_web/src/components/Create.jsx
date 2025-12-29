import React, { useState } from "react";
import axios from "axios";

function Create({ refreshTodos }) {
  const [task, setTask] = useState("");

  const handleAdd = () => {
    if (!task.trim()) return;

    axios
      .post("http://localhost:3001/add", { task })
      .then(() => {
        setTask("");
        refreshTodos();
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="flex gap-3 w-full">
      <input
        type="text"
        placeholder="Enter task"
        className="w-full bg-amber-300 p-3 rounded"
        value={task}
        onChange={e => setTask(e.target.value)}
      />

      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 rounded"
      >
        Add
      </button>
    </div>
  );
}

export default Create;
