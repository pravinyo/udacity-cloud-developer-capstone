import * as uuid from 'uuid'

import { TodosAccess } from "../data/todosAccess"
import { TodoItem } from "../models/TodoItem"
import { CreateTodoRequest } from "../requests/CreateTodoRequest"
import { parseUserId } from '../auth/utils'
import { TodoDeleteResponse } from '../models/TodoDeleteResponse'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdateResponse } from '../models/TodoUpdateResponse'

const todoAccess = new TodosAccess()
const bucketName = process.env.IMAGES_S3_BUCKET

 /**
   * Helpher function to get all todos for provided Token. It extracts the userId and uses it to get right 
   * todo list for this user
   * @param jwtToken unique token for the user
   * 
   * @returns Array list of todos 
   */
export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {

  const userId = parseUserId(jwtToken)

  return todoAccess.getAllTodos(userId)
}

 /**
   * Helpher function to get all todos for provided Token. It extracts the userId and uses it to get right 
   * context to create new todo for user
   * @param jwtToken unique token for the user
   * 
   *  @param createTodoRequest necessary data for creation of new todo item
   * 
   * @returns returns newly created todo with additional details
   */
export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string,
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    name: createTodoRequest.name,
    createdAt: new Date().toISOString(),
    dueDate: createTodoRequest.dueDate,
    done:false,//default behavior
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
  })
}

 /**
   * Helpher function to delete todo for provided Token. It extracts the userId and uses it to get right 
   * context to delete existing todo for user
   * @param jwtToken unique token for the user
   * 
   *  @param todoId an todoId is uniquely identify todo item
   * 
   * @returns deletion response
   */
export async function deleteTodo(
  todoId: string,
  jwtToken: string
): Promise<TodoDeleteResponse> {

  const userId = parseUserId(jwtToken)

  return await todoAccess.deleteTodo(todoId,userId)
}

 /**
   * Helpher function to update todo for provided Token. It extracts the userId and uses it to get right 
   * context to update existing todo for user
   * @param jwtToken unique token for the user
   * 
   * @param todoId an todoId is uniquely identify todo item
   * 
   * @param request object which holds new data to be updated
   * 
   * @returns update response
   */
export async function updateTodo(
  todoId: string,
  request: UpdateTodoRequest,
  jwtToken:string
): Promise<TodoUpdateResponse> {

  const userId = parseUserId(jwtToken)

  return await todoAccess.updateTodo(todoId,request,userId)
}

 /**
   * Helpher function to check todo exist for provided Token. It extracts the userId and uses it to get right 
   * context to check existing todo for user
   * @param jwtToken unique token for the user
   * 
   * @param todoId an todoId is uniquely identify todo item
   * 
   * @returns boolean response
   */
export async function isTodoExsts(
  todoId: string,
  jwtToken:string
): Promise<Boolean> {

  const userId = parseUserId(jwtToken)

  return await todoAccess.todoExists(todoId,userId)
}