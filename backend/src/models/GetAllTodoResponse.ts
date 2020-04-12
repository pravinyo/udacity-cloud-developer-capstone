import { TodoItem } from "./TodoItem";

export interface GetAllTodoResponse {
    items: TodoItem[],
    lastEvaluatedKey: any
  }