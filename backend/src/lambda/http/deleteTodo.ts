import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteTodo } from '../../domain/todos'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { TodoDeleteResponse } from '../../models/TodoDeleteResponse'
import { extractToken } from '../../auth/utils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  const jwtToken = extractToken(event.headers.Authorization)

  //Remove a TODO item by id
  const response : TodoDeleteResponse = await deleteTodo(todoId,jwtToken)

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
