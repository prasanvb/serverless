# Serverless

- [serverless.yml example](0-aws-nodejs/serverless.yml)

## Handlers

- Methods that process events `Exports.handler = (event, context, callback) => {...}`

  - Takes three arguments: event, context, callback
  - Events:
    - contains information from the invoker (JSON)
    - Structure varies for AWS services invoking function
    - <https://docs.aws.amazon.com/lambda/latest/dg/lambda-services.html>
  - Context:
    - contains information about the invocation, function, and execution environment.
    - <https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html>
  - Callback:
    - function that you can call in non-async handlers to send a response
    - Response compatible with JSON.stringify.

### Sample Event Object REST API

```js

  event: {
    body: null,
    headers: {
      Host: 'localhost:3000',
      Connection: 'keep-alive',
      'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
      'Sec-Fetch-Dest': 'document',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'en-US,en;q=0.9,da;q=0.8'
    },
    httpMethod: 'GET',
    isBase64Encoded: false,
    multiValueHeaders: {
      Host: [Array],
      Connection: [Array],
      'sec-ch-ua': [Array],
      'sec-ch-ua-mobile': [Array],
      'sec-ch-ua-platform': [Array],
      'Upgrade-Insecure-Requests': [Array],
      'User-Agent': [Array],
      Accept: [Array],
      'Sec-Fetch-Site': [Array],
      'Sec-Fetch-Mode': [Array],
      'Sec-Fetch-User': [Array],
      'Sec-Fetch-Dest': [Array],
      'Accept-Encoding': [Array],
      'Accept-Language': [Array]
    },
    multiValueQueryStringParameters: null,
    path: '/hello-world',
    pathParameters: null,
    queryStringParameters: null,
    requestContext: {
      accountId: 'offlineContext_accountId',
      apiId: 'offlineContext_apiId',
      domainName: 'offlineContext_domainName',
      domainPrefix: 'offlineContext_domainPrefix',
      extendedRequestId: '18183438-6708-4f2e-8c97-774b71ad01f5',
      httpMethod: 'GET',
      identity: [Object],
      operationName: undefined,
      path: '/hello-world',
      protocol: 'HTTP/1.1',
      requestId: '4040f799-31da-481a-b0db-d20c86655d79',
      requestTime: '20/Nov/2024:18:30:08 -0800',
      requestTimeEpoch: 1732156208264,
      resourceId: 'offlineContext_resourceId',
      resourcePath: '/dev/hello-world',
      stage: 'dev'
    },
    resource: '/hello-world',
    stageVariables: null
  }
```

### Sample Context Object REST API

```js
  context: {
    awsRequestId: '80a5561a-2b66-4e51-8804-1771d3cbf4da',
    callbackWaitsForEmptyEventLoop: true,
    clientContext: null,
    functionName: 'service-1-rest-api-dev-helloWorld',
    functionVersion: '$LATEST',
    identity: undefined,
    invokedFunctionArn: 'offline_invokedFunctionArn_for_service-1-rest-api-dev-helloWorld',
    logGroupName: 'offline_logGroupName_for_service-1-rest-api-dev-helloWorld',
    logStreamName: 'offline_logStreamName_for_service-1-rest-api-dev-helloWorld',
    memoryLimitInMB: '1024',
    done: [Function: done],
    fail: [Function: fail],
    getRemainingTimeInMillis: [Function: getRemainingTimeInMillis],
    succeed: [Function: succeed]
  }
```

### context.callbackWaitsForEmptyEventLoop

- NOTE: `callbackWaitsForEmptyEventLoop` default `true`. So fucntion execution continues until event loop is empty or the function times out. Need to manually set it to false

  ```js
  const AWS = require('aws-sdk')
  const s3 = new AWS.S3(

  exports. handler = function (event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false
    s3. listBuckets(null, callback)

    setTimeout (function () {
    console. log( 'Timeout complete.')
    }, 5000)
  }
  ```

## Async Handler

- Does not require callback function
- return or throw to send response - `Exports.handler = async (event,conyext) ={...}`
- For libraries that return a promise, you can return that promise directly to the runtime
  - `return s3.listBuckets().promise()`
- When you designate code as an ES module, you can use the await keyword at the top level of code.
