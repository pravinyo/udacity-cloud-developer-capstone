import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

export const XAWS = AWSXRay.captureAWS(AWS)

/**
  * Helpher function which checks running environment and create appropriate instances for docClient
  *
  * @returns Dynamodb Document Client instance
  */
export function createDynamoDBClient():DocumentClient {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance');
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    });
  }
  return new XAWS.DynamoDB.DocumentClient();
}
