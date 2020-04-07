import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../domain/todos'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  // Update a TODO item with the provided id using values in the "updatedTodo" object
  const response = await updateTodo(todoId,updatedTodo,jwtToken)

  return {
    statusCode: response.status,
    body: JSON.stringify({})
  }
})


handler.use(
  cors({
    credentials: true
  })
)
