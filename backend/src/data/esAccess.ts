import { createLogger } from '../utils/logger'
import { LogNewTodoEventInES } from '../requests/LogNewTodoEventInES'
import { ElasticSearchLogCategory } from '../models/ElasticSearchLogCategory'
import { Client } from 'elasticsearch'

const logger = createLogger('esLogger')

export class ESAccess {

    constructor(
      private readonly es:Client) {
    }
  
    /**
     * Create log entry in elasticSearch for todo items
     * @param LogNewTodoEventInES an logEvent sent to be be saved in ElasticSearch
     *
     * @returns empty
     */
    async log(logDetails:LogNewTodoEventInES) {
      logger.info('Creating Log in ES: ', logDetails)

      const body = {
        todoId: logDetails.todo.todoId,
        userid: logDetails.todo.userId,
        attachmentUrl: logDetails.todo.attachmentUrl,
        todoTitle: logDetails.todo.name,
        timestamp: logDetails.todo.createdAt
      }
  
      await this.es.index({
        index: logDetails.index,
        type: logDetails.type,
        id: logDetails.id,
        body
      })
    }

    /**
     * Search log entry in elasticSearch for todo items
     * @param query pattern of logs to be searched
     *
     * @param isCompleted boolean value to indicate where to search for
     * 
     * @returns array of todoItem
     */
    async searchNewTodo(query:string,userId:String):Promise<any> {
      logger.info('Search ES for : ', query)
   
      const param = {
        "multi_match": {
          "query": query+ " "+userId,
          "type":       "cross_fields",
          "fields": ["todoTitle","userid"],
          "operator":   "and"
        }
      }

      logger.info("Query for new todo list:",param)

      return await this.es.search({
        index: ElasticSearchLogCategory.NEW_TODO,
        type: 'todos',
        body:{
          "query": param
          }
      })
    }


    /**
     * Search log entry in elasticSearch for todo items
     * @param query pattern of logs to be searched
     *
     * @param isCompleted boolean value to indicate where to search for
     * 
     * @returns array of todoItem
     */
    async searchDoneTodo(query:string,userId:String):Promise<any> {
      logger.info('Search ES for : ', query)

      const param = {
        "multi_match": {
          "query": query+ " "+userId,
          "type":       "cross_fields",
          "fields": ["todoTitle","userid"],
          "operator":   "and"
        }
      }

      logger.info("Query for completed todo list:",param)
    
      return await this.es.search({
        index: ElasticSearchLogCategory.DONE_TODO,
        type: 'todos',
        body:{
          "query": param
        }
      })
    }
  }