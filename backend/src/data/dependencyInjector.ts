import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { Client } from "elasticsearch";
import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'

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

/**
 * Helpher function which creates new instance of elastic search client
 * 
 */
export function createElasticSearchClient():Client {

  const esHost = process.env.ES_ENDPOINT
  
  return new elasticsearch.Client({
      hosts: [ esHost ],connectionClass: httpAwsEs})
}

/**
 * Helpher function which creates new instance of SNS for publish of messages
 * 
 */
export function createTodosSNSInstance():AWS.SNS {
  return new XAWS.SNS()
}