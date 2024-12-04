# SERVERLESS ENVIRONMENT VARIABLES

- As of serverless framework version 3 the default setting is `useDotenv: true`

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
