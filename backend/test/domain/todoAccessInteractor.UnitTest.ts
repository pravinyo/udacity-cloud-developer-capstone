import { expect } from 'chai';
import 'mocha';
import { FakeTodoAccess } from '../data/FakeTodoAccess';
import { TodoInteractor } from '../../src/interactor/todosInteractor';

describe('Todo Access using Interactor', function () {
 
    let env: NodeJS.ProcessEnv
    let todoInteractor:TodoInteractor
    const bucketName = "images"
    let limit=1
    let nextKey="1"
    
    beforeEach = ()=>{
        env = process.env

        process.env.TODOS_TABLE = "todos"
        process.env.USER_ID_INDEX = "userId"
    }

    it('returns all todo', async function () {

        const token1= `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcmF2aW4iLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.rAX7xQwEWxZxuduJH9Xu83OdMUxcCkbJdgusOWDqCzM`
        todoInteractor = new TodoInteractor(new FakeTodoAccess(),bucketName)

        const alltodos = await todoInteractor.getAllTodos(token1,limit,nextKey)
        
        expect(alltodos.items.length).to.equals(1)
        
    });

    it('returns empty todos', async function () {

        const token2 = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcmF2aW4xIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Mxt9br2471u935Qd01AeIRxIEZ5ggEJHxy3pcCXQ6gU`
        todoInteractor = new TodoInteractor(new FakeTodoAccess(),bucketName)
        const alltodos = await todoInteractor.getAllTodos(token2,limit,nextKey)

        expect(alltodos.items.length).to.equals(0)
        
    });

    afterEach = ()=>{
        process.env = env
    }
});