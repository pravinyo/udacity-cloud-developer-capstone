import { SNSAccess } from "../data/snsAccess";
import { createTodosSNSInstance } from "../data/dependencyInjector";

const snsArn = process.env.SNS_ARN
const topic = process.env.TOPIC_NAME

const snsHandler = new SNSAccess(
    createTodosSNSInstance(),
    snsArn,
    topic)


/**
   *  Wrapper function to create log of new TodoItem provided by the user.
   * @param todoTitle item name to be notified
   *
   * @returns nothing
   */
  export async function notifyForNewTodo(
    todoTitle:string
  ){
      await snsHandler.publishNewTodoMessage(todoTitle)
  }

  /**
   *  Wrapper function to create log of new TodoItem provided by the user.
   * @param todoTitle item name to be notified
   *
   * @returns nothing
   */
  export async function notifyForDoneTodo(
    todoTitle:string
  ){
      await snsHandler.publishDoneTodoMessage(todoTitle)
  }