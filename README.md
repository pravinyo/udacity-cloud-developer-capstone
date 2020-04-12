# Serverless TODO Application
[![Build Status](https://travis-ci.com/pravinyo/udacity-cloud-developer-capstone.svg?branch=master)](https://travis-ci.com/pravinyo/udacity-cloud-developer-capstone) ![Unit testing Backend Domain Logic](https://github.com/pravinyo/udacity-cloud-developer-capstone/workflows/Unit%20testing%20Backend%20Domain%20Logic/badge.svg?branch=git_action_ci) ![Deploy Master Branch to Production](https://github.com/pravinyo/udacity-cloud-developer-capstone/workflows/Deploy%20Master%20Branch%20to%20Production/badge.svg) [![Github license](https://img.shields.io/pypi/l/ansicolortags.svg)](https://github.com/pravinyo/udacity-cloud-developer-capstone)

A simple TODOs Application build using AWS serverless stack for managing client request. It is created as part of Udacity Cloud Developer Nanodegree Program. 

# Functionality of the application

This application will allow creating/removing/updating/fetching TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.

# TODO items

The application should store TODO items, and each TODO item contains the following fields:

* `todoId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a TODO item (e.g. "Change a light bulb")
* `dueDate` (string) - date and time by which an item should be completed
* `done` (boolean) - true if an item was completed, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a TODO item

It uses userId extracted from Authentication Token to manage todos

# API Available from Backend:

Please refer this [ReadMe Link](backend/README.md) for working of each lambda function.

Following are the API/functions that are supported by the TODO application. Refer below for accessing API and parameter they accept and request type they expect and serve.

* `CreateTodo` - create a new TODO for a current user. A shape of data send by a client application to this function can be found in the `CreateTodoRequest.ts` file.

  Client Application sends a new request for creation of new todo item in JSON format that looks like this:

  ```json
  {
    "name": "Complete Monday report",
    "dueDate": "2020-04-12"
  }
  ```
  Both `name` and `dueDate` are the required parameter and need to be sent on POST request along with Authentication Bearer Token.

  API access endpoint: POST `https://{{apiId}}.execute-api.us-east-1.amazonaws.com/dev/todos`.

  On successful creation of TodoItem in backend, API sends JSON response to the client with additional details to complete the request from Client end. It looks like this:

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


* `UpdateTodo` - update a TODO item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateTodoRequest.ts` file

  It receives an object that contains three fields that can be updated in a TODO item:

  ```json
  {
    "name": "Buy bread",
    "dueDate": "2019-07-29T20:01:45.424Z",
    "done": true
  }
  ```

  The id of an item that should be updated is passed as a `URL parameter`.
  It returns an empty body.

  API access endpoint: PATCH `https://{{apiId}}.execute-api.us-east-1.amazonaws.com/dev/todos/{{todoId}}`

* `DeleteTodo` - delete a TODO item created by a current user. Expects an id of a TODO item to remove.
The id of an item that should be deleted is passed as a `URL parameter`.
It should return an empty body.

  Access Endpoint: DELETE `https://{{apiId}}.execute-api.us-east-1.amazonaws.com/dev/todos/fe671583-4512-45f6-9475-4265c04362fb`

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a TODO item.

  It should return a JSON object that looks like this:

  ```json
  {
    "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
  }
  ```
  API access endpoint: POST `https://{{apiId}}.execute-api.us-east-1.amazonaws.com/dev/todos/3836b777-9bc4-4429-9b79-ba4e4f5f91c0/attachment`

* `GetAllTodos` - returns a list of todos for userId. It accepts `limit` and `nextKey` as url parameter for accessing all the todos. When no parameter are provided API by default return 10 lastest Todo Items from the server. To limit the count of results fetched from the backend use `limit` parameter and to browse next set of data use `nextKey` and supply the values returned by the previous API result which let the server know you are trying to access next set of data.

  It should return a Array list of JSON object that looks like this:

  ```json
  {
    "items": [{
      "todoId": "1",
      "createdAt": "2020-04-11T20:01:45.424Z",
      "name": "Complete Monday report",
      "dueDate": "2020-04-12T20:01:45.424Z",
      "done": false,
      "attachmentUrl": "http://example.com/image.png"
    },
    {
      "todoId": "2",
      "createdAt": "2020-04-11T20:01:45.424Z",
      "name": "Buy milk",
      "dueDate": "2020-04-12T20:01:45.424Z",
      "done": false,
      "attachmentUrl": "http://example.com/image.png"
    },...] 
  }
  ```
  API access endpoint: GET `https://{{apiId}}.execute-api.us-east-1.amazonaws.com/dev/todos?limit={{limit}}&nextKey={{nextKey}}`

* `SearchTodos` - returns a list of todos for userId matching `query` param. It serves request on POST method. It basically search the todo items in either `Pending` or `done` Todos and this need to be specified in request body in `on` param. Request sent from Client Appliction looks like this:
  ```json
  {
    "query" : "report",
    "on": "done"
  }
  ```

  `on` param accepts two value `Pending` and `done`.

  It should return a Array list of JSON object that matched the query param and here is the sample response:

  ```json
    {
      "resturnRes": {
          "total": 1,
          "max_score": 1.1507283,
          "hits": [
              {
                  "_index": "done-index",
                  "_type": "todos",
                  "_id": "userId",
                  "_score": 1.1507283,
                  "_source": {
                      "todoId": "a7b991ab-a107-4e12-8997-a062c003f6db",
                      "userid": "userId",
                      "attachmentUrl": "http://example.com/image.png",
                      "todoTitle": "Finished Monday report",
                      "timestamp": "2020-04-12T07:10:28.091Z"
                  }
              }
          ]
      }
  }
  ```
  API access endpoint: POST `https://{{apiId}}.execute-api.us-east-1.amazonaws.com/dev/todos/search`


All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.


# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication
It uses Auth0 Authentication Service to Identify user and generate token for user. This Token is used 
to identify user and access/manipulate data for userId.

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v --aws-profile <name>
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

# Postman collection

Sample Collection test has been included in the repository to import directly in Postman and test the functionality. 

Here is the [Collection Link](./FinalProject.postman_collection.json)

Before Testing, we need to get the Auth Token that will be used to Authentication with the backend. It can be found by copying the Auth Token in browser console. Client code saves the token and it can be logged in the console to use with Postman.

# Tech Stack:
  It uses AWS serverless to manage backend and run our application. Following Technologies has been used to develop this Project.

  * `AWS Serverless` - It is managing our Lambda functions which handles our API request which is been routed via API Gateway.

  * `Elastic Search` - It keeps the logging details for new todos created and todos completed by the user. It has separate index for new Todo created as `todo-index` and done todos as `done-index`. It is also used for searching the existing todos created by the user.

  * `Simple Notification Service` - It is used to notify user when todos is been created or finished by the user. To receive the notification, we have to manually register email/number on SNS console and once it is verified we will be receiving the message. Images has been shares for the demo of SNS.

  * `Canary Depoyment` - It has support for canary deployment feature which shift the traffic `10% every 1 minute` in linear fashion. It uses `CodeDeploy Service` of AWS to monitor the deployment of the new version of the lambda function.

  * `CI Support` -  It uses `Git Action` for handling CI and Unit testing of the backend logic of the application. 

  * `CD Support` - It uses `Git Action` for deployment of application to the AWS server. It uses serverless framework for build and deploy of the lambda functions.


# CI / CD Integeration:

It uses `Git Action` for Continuous Integeration and Deployment of the Serverless application. It has two build yaml files:
 * [build_test.yml](.github/workflows/build_test.yml) - It test the business logic of the application of each push on either branch. It uses Nodejs 10.x and Nodejs12.x as two environment to test the application

 * [build_deploy.yml](.github/workflows/build_deploy.yml) - This script executes only on master branch and it does lots of task before deploying the application to the AWS Server. please refer the link to understand more. This script runs on `Nodejs12.x` environment as our Production server runs this version of Node for servering the outside world.


 

