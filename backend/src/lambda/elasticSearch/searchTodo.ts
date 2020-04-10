import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { searchNewTodoInES } from '../../domain/elasticSearch'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const query:string = event.pathParameters.query
  
  /*
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
*/
  const results = await searchNewTodoInES(query)

  return {
    statusCode: 200,
    body: JSON.stringify({
      results
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)