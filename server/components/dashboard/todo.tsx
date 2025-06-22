import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import TodoForm from "./todo-form";

import TodoList from "./todo-list";

const Todo = async () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>To Do List</CardTitle>
      </CardHeader>
      <CardContent>
        <TodoForm />
        <TodoList />
      </CardContent>
    </Card>
  );
};

export default Todo;
