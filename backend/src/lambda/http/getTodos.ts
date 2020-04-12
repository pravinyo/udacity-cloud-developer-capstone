import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllTodos } from '../../domain/todos'
import { extractToken } from '../../auth/utils'
import { GetAllTodoResponse } from '../../models/GetAllTodoResponse'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get all TODO items for a current user

  let nextKey: any // Next key to continue query operation if necessary
  let limit:number // Maximum number of elements to return

  const jwtToken = extractToken(event.headers.Authorization)

  try {
    // Parse query parameters
    nextKey = parseNextKeyParameter(event)
    limit = parseLimitParameter(event) || 10
  } catch (e) {
    console.log('Failed to parse query parameters: ', e.message)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid parameters'
      })
    }
  }

  const results:GetAllTodoResponse = await getAllTodos(jwtToken,limit,nextKey)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: results.items,
      nextKey: encodeNextKey(results.lastEvaluatedKey)
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)


/**
 * Get value of the limit parameter.
 *
 * @param {Object} event HTTP event passed to a Lambda function
 *
 * @returns {number} parsed "limit" parameter
 */
function parseLimitParameter(event) {
  const limitStr = getQueryParameter(event, 'limit')
  if (!limitStr) {
    return undefined
  }

  const limit = parseInt(limitStr, 10)
  if (limit <= 0) {
    throw new Error('Limit should be positive')
  }

  return limit
}

/**
 * Get value of the limit parameter.
 *
 * @param {Object} event HTTP event passed to a Lambda function
 *
 * @returns {Object} parsed "nextKey" parameter
 */
function parseNextKeyParameter(event) {
  const nextKeyStr = getQueryParameter(event, 'nextKey')
  if (!nextKeyStr) {
    return undefined
  }

  const uriDecoded = decodeURIComponent(nextKeyStr)
  return JSON.parse(uriDecoded)
}

/**
 * Get a query parameter or return "undefined"
 *
 * @param {Object} event HTTP event passed to a Lambda function
 * @param {string} name a name of a query parameter to return
 *
 * @returns {string} a value of a query parameter value or "undefined" if a parameter is not defined
 */
function getQueryParameter(event, name) {
  const queryParams = event.queryStringParameters
  if (!queryParams) {
    return undefined
  }

  return queryParams[name]
}

/**
 * Encode last evaluated key using
 *
 * @param {Object} lastEvaluatedKey a JS object that represents last evaluated key
 *
 * @return {string} URI encoded last evaluated key
 */
function encodeNextKey(lastEvaluatedKey) {
  if (!lastEvaluatedKey) {
    return null
  }

  return encodeURIComponent(JSON.stringify(lastEvaluatedKey))
}