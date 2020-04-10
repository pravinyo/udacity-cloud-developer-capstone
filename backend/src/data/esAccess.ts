import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'

import { createLogger } from '../utils/logger'
import { LogNewTodoEventInES } from '../requests/LogNewTodoEventInES'
import { Bool } from 'aws-sdk/clients/clouddirectory'
import { TodoItem } from '../models/TodoItem'

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
    async searchCompletedTodo(query:string,cat : ElasticSearchLogCategory):Promise<any> {
      logger.info('Search ES for : ', query)

      let logIndex:string
  
      if(cat == ElasticSearchLogCategory.DONE_TODO){
        logIndex = ElasticSearchLogCategory.DONE_TODO
      }else{
        logIndex = ElasticSearchLogCategory.NEW_TODO
      }

      return await this.es.search({
        index: logIndex,
        type: 'todos',
        body:{
          query:{
            regexp:{
              "name": query+".*"
            }
          }
        }
      })
    }
  }