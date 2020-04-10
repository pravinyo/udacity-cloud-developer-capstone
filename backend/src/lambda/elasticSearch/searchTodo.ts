import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { searchNewTodoInES, searchDoneTodoInES } from '../../domain/elasticSearch'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const request = JSON.parse(event.body)
  
  
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  console.log("Received request",request)
  console.log("Query is :",request.query)
  let results:any

  if(request.on === "pending"){
    results = await searchNewTodoInES(request.query,jwtToken)
  }else if(request.on ="done"){
    results = await searchDoneTodoInES(request.query,jwtToken)
  }else{
    return {
      statusCode: 400,
      body: JSON.stringify({
        results:"Invalid param value for On parameter"
      })
    }
  }

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