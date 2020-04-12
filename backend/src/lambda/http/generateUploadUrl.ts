import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { isTodoExsts } from '../../domain/todos'
import { extractToken } from '../../auth/utils'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const expiration = process.env.SIGNED_URL_EXPIRATION
const urlExpiration = Number(expiration) || 300

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  //Extract token
  const jwtToken = extractToken(event.headers.Authorization)

  // Return a presigned URL to upload a file for a TODO item with the provided id
  const isExitsandAllowed = await isTodoExsts(todoId,jwtToken)
  if(isExitsandAllowed){
    const url = getUploadUrl(todoId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  }else{
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    }
  }

  return undefined
})

handler.use(
  cors({
    credentials: true
  })
)

function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}
