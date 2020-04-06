import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoDeleteResponse } from '../models/TodoDeleteResponse'
import { TodoUpdateResponse } from '../models/TodoUpdateResponse'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX) {
  }

  async getAllTodos(userId:string): Promise<TodoItem[]> {
    console.log('Getting all Todos for: ', userId)

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.userIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues:{
          ':userId':userId
      }
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async getTodoBy(id:string) : Promise<TodoItem>{
    const result =  await this.docClient.query({
        TableName : this.todosTable,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
            ':todoId': id
        }
    }).promise()

    if(result.Count!=0){
      return result[0]
    }

    return undefined
  }

  async deleteTodo(todoId: string, userId: string): Promise<TodoDeleteResponse> {

    const item = await this.getTodoBy(todoId)

    if(item.userId !== userId){
      return {status: 401 ,message: "Not Authorised"} as TodoDeleteResponse
    }

    const res = await this.docClient.delete({
      TableName : this.todosTable,
      Key:{
              "todoId":todoId
          }
    })

    console.log("Deleted:",res)

    return {status: 200 ,message: "Removed"} as TodoDeleteResponse

  }

  async updateTodo(todoId:string,item:UpdateTodoRequest,userId:string):Promise<TodoUpdateResponse>{

    const temp = await this.getTodoBy(todoId)

    if(!temp) return {status: 200 ,message: "Can't Update content"} as TodoUpdateResponse

    if(temp.userId !== userId){
      return {status: 401 ,message: "Not Authorised"} as TodoUpdateResponse
    }

    //User is allowed to update.
    await this.docClient.update({
      TableName: this.todosTable,
      Key:{
          'todoId':todoId
      },
      UpdateExpression: 'set name = :n, dueDate = :d, done = :done',
      ExpressionAttributeValues: {
          ':n' : item.name,
          ':d' : item.dueDate,
          ':done' : item.done
      }
    })

    return {status: 200 ,message: "Updated"} as TodoUpdateResponse
  }

  async todoExists(todoId: string,userId:string):Promise<Boolean> {
    const result = await this.docClient
      .get({
        TableName: this.todosTable,
        Key: {
          todoId: todoId
        }
      })
      .promise()
  
    console.log('Get todo: ', result)
    const isExist = !!result.Item

    if(isExist && result.Item.userId==userId){
      return true
    }

    return false
  }
  
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
