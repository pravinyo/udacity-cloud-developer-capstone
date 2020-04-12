# Serverless TODO Application - Backend
![Unit testing Backend Domain Logic](https://github.com/pravinyo/udacity-cloud-developer-capstone/workflows/Unit%20testing%20Backend%20Domain%20Logic/badge.svg?branch=git_action_ci)

A simple TODOs Application build using AWS serverless stack for managing client request. It is created as part of Udacity Cloud Developer Nanodegree Program. 

### For detailed explanation for usage of API. Please refer this [Readme link](../README.md)

# Working of the Backend Lambda Functions:

* `CreateTodo` - This Lambda Function takes `name` and `dueDate` of the TodoItem to be created in the backend. It first checks whether the user is authorized to create the todo or not. For that it checks the Token provided by the client Application and if it has verified token signature, this function will go ahead and create the todo Item and returns additional details to the client 
  ```json
    {
      "newTodoItem": {
        "todoId": "123",
        "createdAt": "2020-04-11T20:01:45.424Z",
        "name": "Complete Monday report",
        "dueDate": "2020-04-12T20:01:45.424Z",
        "done": false,
        "attachmentUrl": "http://example.com/image.png"
      }
    }
    ```

* `UpdateTodo` - This Lambda function allow user to update existing todos. todoId provided via url parameter is first checked whether user id authorised to update it or not. If user is not authorised, function will return appropriate error code and stop. If id is correct, it will go ahead and complete the action and return completion status code to the user.

* `DeleteTodo` - This Lambda function allow user to delete existing todos. todoId provided via url parameter is first checked whether user id authorised to update it or not. If user is not authorised, function will return appropriate error code and stop. If id is correct, it will go ahead and complete the action and return completion status code to the user.

* `GenerateUploadUrl` - This Lambda function allow user to create new presigned url for the provided todoID with expiration of 5 min. Only Authenticated user will be able to complete the task.

* `GetAllTodos` - This Lambda function uses pagination to allow user to get all the todos associate with him. It uses `limit` and `nextKey` to complete the task. Each response of the api returns new nextKey to allow user to fetch next set of todos.

* `SearchTodo` - This Lambda function uses POST Method to get the necessary param to allow user to searh in elastic search cluster. It accepts two param `query` which is used by user to query the system and `on` to specify where to search the query in system. `on` param accepts two value `Pending` and `done`.


# Testing of the Backend Business Logic
 Backend testing code are stored in `backend/test` folder. It is execute by runing following command in `backend` directory : `npm run test`