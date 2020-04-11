import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import { TodoItem } from '../../models/TodoItem'
import { logNewTodoItemInES, logDoneTodoItemInES } from '../../domain/elasticSearch'
import { notifyForNewTodo, notifyForDoneTodo } from '../../domain/snsNotification'

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  console.log('Processing events batch from DynamoDB', JSON.stringify(event))

  for (const record of event.Records) {
    console.log('Processing record', JSON.stringify(record))
    if (record.eventName == 'INSERT') {
      const newItem = record.dynamodb.NewImage

      const todo : TodoItem = {
        todoId : newItem.todoId.S,
        userId : newItem.userId.S,
        createdAt : newItem.createdAt.S,
        name : newItem.name.S,
        attachmentUrl : newItem.attachmentUrl.S,
        done : newItem.done.BOOL,
        dueDate : newItem.dueDate.S
      }

      await logNewTodoItemInES(todo)
      await notifyForNewTodo(todo.name)

    }else if(record.eventName == 'MODIFY'){
      const newItem = record.dynamodb.NewImage

      const todo : TodoItem = {
        todoId : newItem.todoId.S,
        userId : newItem.userId.S,
        createdAt : newItem.createdAt.S,
        name : newItem.name.S,
        attachmentUrl : newItem.attachmentUrl.S,
        done : newItem.done.BOOL,
        dueDate : newItem.dueDate.S
      }
      
      if(todo.done){
        await logDoneTodoItemInES(todo)
        await notifyForDoneTodo(todo.name)
      }
    }
  }
}