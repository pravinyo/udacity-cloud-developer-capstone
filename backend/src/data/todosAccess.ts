import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { TodoDeleteResponse } from '../models/TodoDeleteResponse'
import { TodoUpdateResponse } from '../models/TodoUpdateResponse'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('todoAccess')

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient,
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX) {
  }

  /**
   * Get all todos for user id from an JWT Token
   * @param userId an userId retrieved from JWT Token
   *
   * @returns Array list of TodoItem for userId
   */
  async getAllTodos(userId:string): Promise<TodoItem[]> {
    logger.info('Getting all Todos for: ', userId)

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

  /**
   *  Create new TodoItem provided by the user.
   * @param TodoItem item enqueued todo
   *
   * @returns todo item as response
   */
  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  /**
   * Get todo item using todoId provided by the user
   * @param todoId an id uniquely identify todo item
   *
   * @returns TodoItem object
   */
  async getTodoBy(todoId:string) : Promise<TodoItem>{
    const result = await this.docClient.get({
          TableName: this.todosTable,
          Key: {
              todoId
          }
      }).promise();
      logger.info("TODOS is checked for ",todoId)

    return result.Item as TodoItem
  }

  /**
   * Delete TodoItem using todoId and userId as supplied parameter. It checks whether supplied todo exist 
   * for current user and it does exist it allows them to delete it otherwise it will return unAuthorized error
   * if todo is owned by other user.
   * @param todoId an todoId uniquely identify todo item
   * 
   * @param userId an userId retrieved from JWT Token
   *
   * @returns delete response from the backend
   */
  async deleteTodo(todoId: string, userId: string): Promise<TodoDeleteResponse> {

    const item = await this.getTodoBy(todoId)

    if(!item){
      logger.info("Item is not found for",todoId)
      return {status: 404 ,message: "Item not Present"} as TodoDeleteResponse
    }

    if(item.userId !== userId){
      logger.warn("Requester id:"+userId+" is different from item user id:"+item.userId)
      return {status: 401 ,message: "Not Authorised"} as TodoDeleteResponse
    }

    const res = await this.docClient.delete({
      TableName : this.todosTable,
      Key:{
              todoId
          }
    }).promise()

    logger.info("Deleted:",res)

    return {status: 200 ,message: "Removed"} as TodoDeleteResponse

  }

  /**
   * Update TodoItem using todoId and userId and new updatedTodo as supplied parameter. It checks whether supplied todo exist 
   * for current user and it does exist it allows them to delete it otherwise it will return unAuthorized error
   * if todo is owned by other user.
   * @param todoId an todoId uniquely identify todo item
   * 
   * @param updatedTodo new value to be update in the backend
   * 
   * @param userId an userId retrieved from JWT Token
   *
   * @returns update response from the backend
   */  
  async updateTodo(todoId:string,updatedTodo:UpdateTodoRequest,userId:string):Promise<TodoUpdateResponse>{

    const temp = await this.getTodoBy(todoId)

    if(!temp) return {status: 200 ,message: "Can't Update content"} as TodoUpdateResponse

    if(temp.userId !== userId){
      logger.warn("User not authorized",userId)
      return {status: 401 ,message: "Not Authorised"} as TodoUpdateResponse
    }

    //User is allowed to update.
    await this.docClient.update({
        TableName: this.todosTable,
        Key: {
            todoId
        },
        UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
        ExpressionAttributeValues: {
            ':n': updatedTodo.name,
            ':due': updatedTodo.dueDate,
            ':d': updatedTodo.done
        },
        ExpressionAttributeNames: {
            '#name': 'name',
            '#dueDate': 'dueDate',
            '#done': 'done'
        }
    }).promise()
    logger.info("Updated todo id:",todoId)

    return {status: 200 ,message: "Updated"} as TodoUpdateResponse
  }
 /**
   * It checks whether provided todoId is present for userId or not.
   * @param todoId an id uniquely identify todo item
   *
   * @param userId an userId retrieved from JWT Token
   * 
   * @returns boolean value true if present else false
   */
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
      logger.info("Todo exists:",todoId)
      return true
    }
    logger.info("Todo not exists:",todoId)
    return false
  }
  
}
