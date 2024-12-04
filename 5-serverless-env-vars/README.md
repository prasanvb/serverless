# SERVERLESS ENVIRONMENT VARIABLES

- As of serverless framework version 3 the default setting is `useDotenv: true`

  - NOTE:
    - not required to explicitly declare it
    - Cannot be set to false

- Environment variables declared in the serverless yml file
  - TEST_VAR: Env var globally declared under provider
  - TEST_VAR_FS: Env var declared function specific
- NESTED_TEST_VAR: Nesting env var
- OVERRIDING_TEST_VAR: Overriding default env var through CLI command

  - `sls deploy --stage prod`

- AWS Systems Manager Parameter Store Secrets and configuration data management

  - `aws ssm put-parameter --name db_username --value "wonder-comp" --type String --region us-west-2`
    - DB_USERNAME_PS
  - `aws ssm put-parameter --name db_password --value "1PaSSword&&" --type SecureString --region us-west-2`
    - DECRYPTED_DB_PASSWORD_PS
    - ENCRYPTED_DB_PASSWORD_PS

- AWS Secrets Manager - Easily rotate, manage, and retrieve secrets throughout their lifecycle

  - `aws secretsmanager create-secret --name db_admin --description "db password for admin" --secret-string "{\"username\":\"admin\",\"password\":\"admin-pass\"}"  --region us-west-2`
    - DB_ADMIN_SM
    - DB_ADMIN_USERNAME_JSON
    - DB_ADMIN_PASSWORD_JSON

- Using DOT env file
