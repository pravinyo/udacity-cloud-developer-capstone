import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../domain/todos'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { extractToken } from '../../auth/utils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  
  const jwtToken = extractToken(event.headers.Authorization)

  // Implement creating a new TODO item
  const newTodoItem = await createTodo(newTodo,jwtToken)

  return {
    statusCode: 201,
    body: JSON.stringify({
      newTodoItem
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)