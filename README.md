# [Serverless](https://serverless.com/framework/docs/)

- [serverless.yml config details](0-aws-nodejs/serverless.yml)
- [serverless.yml env var](5-serverless-env-vars/serverless.yml)
- [serverless.yml dynamodb](6-serverless-dynamodb/serverless.yml)

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
  resource: '/user/{email}',
  path: '/user/prasan@gmail.com',
  httpMethod: 'GET',
  headers: {
    Accept: '*/*',
    'CloudFront-Forwarded-Proto': 'https',
    'CloudFront-Is-Desktop-Viewer': 'true',
    'CloudFront-Is-Mobile-Viewer': 'false',
    'CloudFront-Is-SmartTV-Viewer': 'false',
    'CloudFront-Is-Tablet-Viewer': 'false',
    'CloudFront-Viewer-ASN': '6327',
    'CloudFront-Viewer-Country': 'CA',
    'content-type': 'application/json',
    Host: 'g07wtfh8a7.execute-api.us-west-2.amazonaws.com',
    'User-Agent': 'insomnia/10.1.1',
    Via: '2.0 68912b17b5637bcad753c663791ff7a6.cloudfront.net (CloudFront)',
    'X-Amz-Cf-Id': 'V29Z-MCx11CO6HutWgo7J-N5Z4G_O9sHKH_qZqr0gExLas_tGimt9w==',
    'X-Amzn-Trace-Id': 'Root=1-6747e2d3-3c59550b75dff2c320d008aa',
    'X-Forwarded-For': '70.68.236.240, 3.172.4.20',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https'
  },
  multiValueHeaders: {
    Accept: [Array],
    'CloudFront-Forwarded-Proto': [Array],
    'CloudFront-Is-Desktop-Viewer': [Array],
    'CloudFront-Is-Mobile-Viewer': [Array],
    'CloudFront-Is-SmartTV-Viewer': [Array],
    'CloudFront-Is-Tablet-Viewer': [Array],
    'CloudFront-Viewer-ASN': [Array],
    'CloudFront-Viewer-Country': [Array],
    'content-type': [Array],
    Host: [Array],
    'User-Agent': [Array],
    Via: [Array],
    'X-Amz-Cf-Id': [Array],
    'X-Amzn-Trace-Id': [Array],
    'X-Forwarded-For': [Array],
    'X-Forwarded-Port': [Array],
    'X-Forwarded-Proto': [Array]
  },
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: { email: 'prasan@gmail.com' },
  stageVariables: null,
  requestContext: {
    resourceId: 'vqdqzd',
    resourcePath: '/user/{email}',
    httpMethod: 'GET',
    extendedRequestId: 'B8BhLE0zPHcEd2A=',
    requestTime: '28/Nov/2024:03:26:11 +0000',
    path: '/dev/user/prasan@gmail.com',
    accountId: '980921714626',
    protocol: 'HTTP/1.1',
    stage: 'dev',
    domainPrefix: 'g07wtfh8a7',
    requestTimeEpoch: 1732764371922,
    requestId: '88d53c03-755a-4358-90f0-1133fc543569',
    identity: [Object],
    domainName: 'g07wtfh8a7.execute-api.us-west-2.amazonaws.com',
    deploymentId: 'e9k6g8',
    apiId: 'g07wtfh8a7'
  },
  body: null,
  isBase64Encoded: false
}
```

### Sample Context Object REST API
- When Lambda runs your function, it passes a context object to the handler. This object provides methods and properties that provide information about the invocation, function, and execution environment.

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

### Functions

- createUser

  - POST: <https://g07wtfh8a7.execute-api.us-west-2.amazonaws.com/dev/user>
  - payload

    ```JSON
      {
        "email": "prasanna@gmail.com",
        "username": "prasannab",
        "password": "Asdf!234",
        "firstname": "prasanna",
        "lastname": "bala",
        "country": "canada",
        "zipcode": "QWE456",
        "Gadgets": [
         "phone",
         "watch"
        ],
        "phone": 9876543211,
        "martialStatus": true,
        "identities": {
         "gender": "male",
         "color": "brown"
        }
      }
    ```

- getUser

  - GET: <https://g07wtfh8a7.execute-api.us-west-2.amazonaws.com/dev/user/{email}>

## Dynamodb

- For items with a given partition key value, DynamoDB stores these items close together, in sorted order by sort key value.

### Query Operations

- In a Query operation, DynamoDB retrieves the items in sorted order, and then processes the items using KeyConditionExpression and any FilterExpression that might be present. Only then are the Query results sent back to the client.
- A Query operation always returns a result set. If no matching items are found, the result set is empty.
- Query results are always sorted by the sort key value. If the data type of the sort key is Number, the results are returned in numeric order. Otherwise, the results are returned in order of UTF-8 bytes. By default, the sort order is ascending. To reverse the order, set the ScanIndexForward parameter to false.
- A single Query operation can retrieve a maximum of 1 MB of data.

### Streams

- DynamoDB Stream events have specific event names that indicate the type of operation that triggered the stream.
  - `INSERT`:Triggered when a new item is added to the table.
  - `MODIFY`: Triggered when an existing item is updated.
  - `REMOVE`: Triggered when an existing item is deleted from the table.

## SERVERLESS ENVIRONMENT VARIABLES

- As of serverless framework version 3 the default setting is `useDotenv: true`
- Serverless framework variable system - Reference Values in brackets `§{variableSource}`.
- Recursively reference properties e.g: `${ssm:FE_URL-${opt:stage}}`

  - NOTE:
    - not required to explicitly declare it
    - Cannot be set to false

- Environment variables declared in the serverless yml file

  - TEST_VAR: Env var globally declared under provider
  - TEST_VAR_FS: Env var declared function specific

- NESTED_TEST_VAR: Nesting env var

  - `NESTED_TEST_VAR: serverless-yml-nested-environment-variable-${self:provider.stage}`

- OVERRIDING_TEST_VAR: Overriding default env var through CLI command

  - `OVERRIDING_TEST_VAR: serverless-yml-overriding-environment-variable-${opt:stage, self:provider.stage}`

  - `sls deploy --stage prod`

- AWS Systems Manager Parameter Store Secrets and configuration data management

  - CMD: `aws ssm put-parameter --name db_username --value "wonder-comp" --type String --region us-west-2`

    - `DB_USERNAME_PS: ${ssm:/db_username}`

  - CMD: `aws ssm put-parameter --name db_password --value "1PaSSword&&" --type SecureString --region us-west-2`

    - `DECRYPTED_DB_PASSWORD_PS: ${ssm:/db_password}`
    - `ENCRYPTED_DB_PASSWORD_PS: ${ssm(noDecrypt):/db_password}`

- Convert env vars from string to boolean

  - CMD: `aws ssm put-parameter --name ENABLE_DEBUG --value "1" --type SecureString --region us-west-2`
    - `STR_TO_BOOL: ${strToBool(${ssm:/ENABLE_DEBUG})}`

- AWS Secrets Manager - Easily rotate, manage, and retrieve secrets throughout their lifecycle

  - CMD: `aws secretsmanager create-secret --name db_admin --description "db password for admin" --secret-string "{\"username\":\"admin\",\"password\":\"admin-pass\"}"  --region us-west-2`

    - `DB_ADMIN_SM: ${ssm:/aws/reference/secretsmanager/db_admin}`
    - `DB_ADMIN_USERNAME_JSON: ${self:custom.DB_ADMIN_SM.username}`
    - `DB_ADMIN_PASSWORD_JSON: ${self:custom.DB_ADMIN_SM.password}`

- DOT ENV file variables using serverles-dotenv-pulgin

  - VAR_FROM_DOT_ENV_FILE
  - `ENV_VAR_USING_PLUGIN: ${env:VAR_FROM_DOT_ENV_FILE}-${self:provider.name}`

- Env var from config file

  - `DEV_CONFIG_API_KEY: ${file(./config/config.dev.json):api_key}`
  - `PROD_CONFIG_API_KEY: ${file(./config/config.${opt:stage,'dev'}.json):api_key}`

- Accessing AWS resource identifiers as environment variable

  - `SLS_INSTANCE_ID: ${sls:instanceId}`
  - `AWS_ACCOUNT_ID: ${aws:accountId}`
  - Accessing data from a text file in S3 bucket
    - `S3_VARIABLE: ${s3:slsvariables/envvar.txt}`
  - Accessing cloud formation stack output key and value
    - `CF_SERVICE_ENDPOINT: ${cf:service-5-serverless-env-vars-prod.ServiceEndpoint}`
