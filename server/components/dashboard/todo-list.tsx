"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import TodoForm from "./todo-form";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import RefreshButton from "./refresh-button";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchTodos();
    setRefreshing(false);
  };

  const fetchTodos = async () => {
    const res = await fetch("/api/todo");
    if (res.ok) {
      const data = await res.json();
      setTodos(data);
      setCompletingId(null);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleComplete = async (id: string) => {
    setCompletingId(id);
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: true } : todo))
    );
    await fetch(`/api/todo/${id}`, { method: "PATCH" });
    setTimeout(() => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      setCompletingId(null);
    }, 500);
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>To Do List</CardTitle>
        <RefreshButton refreshing={refreshing} onClick={handleManualRefresh} />
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mt-6">
          <TodoForm onAdd={fetchTodos} />

          <AnimatePresence>
            {todos.map((todo) => {
              const isCompleting = completingId === todo.id;

              return (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border overflow-hidden"
                >
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => handleComplete(todo.id)}
                    className="hover:cursor-pointer"
                  />
                  <span className="relative w-full block">
                    <span
                      className={cn(
                        "block transition-opacity duration-300 text-base",
                        isCompleting && "opacity-60 text-gray-400"
                      )}
                    >
                      {todo.title}
                    </span>

                    {isCompleting && (
                      <motion.div
                        className="absolute top-1/2 left-0 h-[2px] bg-gray-400 z-10"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    )}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoList;
