import { TodoItem } from "../../src/models/TodoItem";
import { ITodoAccess } from "../../src/domain/ITodoAccess";
import { TodoDeleteResponse } from "../../src/models/TodoDeleteResponse";
import { UpdateTodoRequest } from "../../src/requests/UpdateTodoRequest";
import { TodoUpdateResponse } from "../../src/models/TodoUpdateResponse";

export class FakeTodoAccess implements ITodoAccess{
    queryResult = [{
        userId: "pravin",
        todoId: "pravinTodoId",
        createdAt: "2020-04-11",
        name: "Complete Capstone Project",
        dueDate: "2020-05-17",
        done: false,
        attachmentUrl: "http://pravin.com/sample.jpg"
    }]

    getAllTodos(userId: string): Promise<TodoItem[]> {
        
        const returnAllTodos:Promise<TodoItem[]> = new Promise((resolve) => {
            resolve(this.queryResult);
        });

        const returnEmptyTodos:Promise<TodoItem[]> = new Promise((resolve) => {
            resolve([] as TodoItem[]);
        });

        if(userId == this.queryResult[0].userId)  return returnAllTodos
        else return returnEmptyTodos
    }
    createTodo(todo: TodoItem): Promise<TodoItem> {
        return new Promise( (resolve) => {
            resolve(todo)
        })
    }
    getTodoBy(todoId: string): Promise<TodoItem> {
        if(todoId == this.queryResult[0].todoId){
            return new Promise( (resolve) => {
                resolve(this.queryResult[0])
            })
        }else{
            return undefined
        }
    }
    
    deleteTodo(todoId: string, userId: string): Promise<TodoDeleteResponse> {
        console.log(todoId,userId)
        return undefined
    }
    updateTodo(todoId: string, updatedTodo: UpdateTodoRequest, userId: string): Promise<TodoUpdateResponse> {
        console.log(todoId,userId,updatedTodo)
        return undefined
    }
    todoExists(todoId: string, userId: string): Promise<Boolean> {
        console.log(todoId,userId)
        return undefined
    }
}