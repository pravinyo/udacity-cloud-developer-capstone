import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'

import { createLogger } from '../utils/logger'
import { LogNewTodoEventInES } from '../requests/LogNewTodoEventInES'

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
  }