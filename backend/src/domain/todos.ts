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

export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {

  const userId = parseUserId(jwtToken)

  return todoAccess.getAllTodos(userId)
}

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

export async function deleteTodo(
  todoId: string,
  jwtToken: string
): Promise<TodoDeleteResponse> {

  const userId = parseUserId(jwtToken)

  return await todoAccess.deleteTodo(todoId,userId)
}

export async function updateTodo(
  todoId: string,
  request: UpdateTodoRequest,
  jwtToken:string
): Promise<TodoUpdateResponse> {

  const userId = parseUserId(jwtToken)

  return await todoAccess.updateTodo(todoId,request,userId)
}

export async function isTodoExsts(
  todoId: string,
  jwtToken:string
): Promise<Boolean> {

  const userId = parseUserId(jwtToken)

  return await todoAccess.todoExists(todoId,userId)
}