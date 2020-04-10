import { TodoItem } from "../models/TodoItem";
import { ESAccess } from "../data/esAccess";

const esAccess = new ESAccess()

export async function logNewTodoItemInES(
    todo:TodoItem
  ){
      await esAccess.log({
          index:'todos-index',
          type:'todos',
          id:todo.userId,
          todo:todo
      })
  }

export async function logDoneTodoItemInES(
    todo:TodoItem
  ){
      await esAccess.log({
          index:'done-index',
          type:'todos',
          id:todo.userId,
          todo:todo
      })
  }