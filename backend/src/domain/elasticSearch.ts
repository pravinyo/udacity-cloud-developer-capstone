import { TodoItem } from "../models/TodoItem";
import { ESAccess } from "../data/esAccess";
import { ElasticSearchLogCategory } from "../models/ElasticSearchLogCategory";
import { parseUserId } from "../auth/utils";
import { createElasticSearchClient } from "../data/dependencyInjector";

const esAccess = new ESAccess(createElasticSearchClient())

/**
   *  Wrapper function to create log of new TodoItem provided by the user.
   * @param TodoItem item enqueued todo
   *
   * @returns nothing
   */
export async function logNewTodoItemInES(
    todo:TodoItem
  ){
      await esAccess.log({
          index: ElasticSearchLogCategory.NEW_TODO,
          type:'todos',
          id:todo.userId,
          todo:todo
      })
  }

/**
   *  Wrapper function to create log of done/completed TodoItem provided by the user.
   * @param TodoItem item enqueued todo
   *
   * @returns nothing
   */
export async function logDoneTodoItemInES(
    todo:TodoItem
  ){
      await esAccess.log({
          index:ElasticSearchLogCategory.DONE_TODO,
          type:'todos',
          id:todo.userId,
          todo:todo
      })
  }


  /**
   *  Wrapper function to search name of todo done/completed in ElasticSearch provided by the user.
   * @param query item name starting with
   *
   * @returns any
   */
export async function searchDoneTodoInES(
    query:string,
    jwtToken:string
  ):Promise<any>{
    const user = parseUserId(jwtToken)
    
    return await esAccess.searchDoneTodo(query,user)
  }

    /**
   *  Wrapper function to search name of todo newly created in ElasticSearch provided by the user.
   * @param query item name starting with
   *
   * @returns any
   */
export async function searchNewTodoInES(
    query:string,
    jwtToken:string
  ):Promise<any>{
      const user = parseUserId(jwtToken)

      return await esAccess.searchNewTodo(query,user)
  }