import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'

import { createLogger } from '../utils/logger'
import { LogNewTodoEventInES } from '../requests/LogNewTodoEventInES'
//import { ElasticSearchLogCategory } from '../models/ElasticSearchLogCategory'

const logger = createLogger('esLogger')
const esHost = process.env.ES_ENDPOINT

export class ESAccess {

    constructor(
      private readonly es = new elasticsearch.Client({
        hosts: [ esHost ],connectionClass: httpAwsEs})) {
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
    async searchNewTodo(query:string):Promise<any> {
      logger.info('Search ES for : ', query)

      logger.info("Query for new todo list:"+query)
    
      return await this.es.search({
        index: 'todos-index',
        type: 'todos',
        body:{
          "query": {
            "simple_query_string": {
              "query": query,
              "fields": ["todoTitle"]
            }
          }
        }
      })
    }

    /**
     * "query": {
    "multi_match": {
      "query": "part google-oauth2|112567431979117533864",
      "type":       "cross_fields",
      "fields": ["todoTitle","userid"],
      "operator":   "and"
    }
  }

     */

    /**
     * Search log entry in elasticSearch for todo items
     * @param query pattern of logs to be searched
     *
     * @param isCompleted boolean value to indicate where to search for
     * 
     * @returns array of todoItem
     */
    async searchDoneTodo(query:string):Promise<any> {
      logger.info('Search ES for : ', query)

      logger.info("Query for completed todo list:"+query)
    
      return await this.es.search({
        index: 'done-index',
        type: 'todos',
        body:{
          "query": {
            "simple_query_string": {
              "query": query,
              "fields": ["todoTitle"]
            }
          }
        }
      })
    }
  }