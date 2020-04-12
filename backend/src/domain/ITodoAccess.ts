import { TodoItem } from "../models/TodoItem";
import { TodoDeleteResponse } from "../models/TodoDeleteResponse";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { TodoUpdateResponse } from "../models/TodoUpdateResponse";
import { GetAllTodoResponse } from "../models/GetAllTodoResponse";

export interface ITodoAccess{
    getAllTodos(userId:string,limit:number,nextKey:any): Promise<GetAllTodoResponse>;
    createTodo(todo: TodoItem): Promise<TodoItem>;
    getTodoBy(todoId:string) : Promise<TodoItem>;
    deleteTodo(todoId: string, userId: string): Promise<TodoDeleteResponse>;
    updateTodo(todoId:string,updatedTodo:UpdateTodoRequest,userId:string):Promise<TodoUpdateResponse>;
    todoExists(todoId: string,userId:string):Promise<Boolean>;
}