
import { TodosAccess } from "../data/todosAccess"
import { TodoItem } from "../models/TodoItem"
import { CreateTodoRequest } from "../requests/CreateTodoRequest"
import { TodoDeleteResponse } from '../models/TodoDeleteResponse'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdateResponse } from '../models/TodoUpdateResponse'
import { TodoInteractor } from '../interactor/todosInteractor'
import { createDynamoDBClient } from '../data/dependencyInjector'

const bucketName = process.env.IMAGES_S3_BUCKET
const todoInteractor = new TodoInteractor(new TodosAccess(createDynamoDBClient()),bucketName)

 /**
   * Helpher function to get all todos for provided Token. It extracts the userId and uses it to get right 
   * todo list for this user
   * @param jwtToken unique token for the user
   * 
   * @returns Array list of todos 
   */
export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
  return todoInteractor.getAllTodos(jwtToken)
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

  return await todoInteractor.createTodo(createTodoRequest,jwtToken)
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

  return await todoInteractor.deleteTodo(todoId,jwtToken)
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

  return await todoInteractor.updateTodo(todoId,request,jwtToken)
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

  return await todoInteractor.isTodoExsts(todoId,jwtToken)
}