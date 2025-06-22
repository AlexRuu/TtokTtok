"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Checkbox } from "../ui/checkbox";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

const TodoList = () => {
  return (
    <div>
      {/* {todos.map((todo) => (
        <div key={todo.id} className="flex items-center gap-2">
          <Checkbox onClick={() => handleComplete(todo.id)} />
          <span>{todo.title}</span>
        </div>
      ))} */}
    </div>
  );
};

export default TodoList;
