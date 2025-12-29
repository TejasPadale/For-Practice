import React, { useEffect, useState } from "react";
import axios from "axios";
import Create from "./Create";
import TodoItem from "./TodoItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function Home() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = () => {
    axios
      .get("http://localhost:3001/get")
      .then((res) => setTodos(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    const reordered = items.map((todo, index) => ({
      ...todo,
      order: index + 1,
    }));

    setTodos(reordered);

    axios.put("http://localhost:3001/reorder", {
      todos: reordered.map((t) => ({ _id: t._id, order: t.order })),
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 flex flex-col">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-center text-gray-800  mb-4">
          📝 Simple MERN To-Do App
        </h1>

        {/* CREATE */}
        <Create refreshTodos={fetchTodos} />

        {/* TODO LIST (SCROLLABLE AREA) */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="
                  mt-4
                  space-y-2
                  max-h-105
                  overflow-y-auto
                  pr-1
                "
              >
                {todos.length === 0 && (
                  <p className="text-center text-gray-400">
                    No tasks yet. Add one 🚀
                  </p>
                )}

                {todos.map((todo, index) => (
                  <Draggable
                    key={todo._id}
                    draggableId={todo._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TodoItem
                          todo={todo}
                          refreshTodos={fetchTodos}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

      </div>
    </div>
  );
}

export default Home;
