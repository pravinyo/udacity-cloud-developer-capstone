import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllTodos } from '../../domain/todos'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get all TODO items for a current user

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const results = await getAllTodos(jwtToken)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: results
    })
  }

})

handler.use(
  cors({
    credentials: true
  })
)