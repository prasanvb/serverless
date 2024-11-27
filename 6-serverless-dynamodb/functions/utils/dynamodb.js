import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";

const config = {
  region: "us-west-2",
};

const client = new DynamoDBClient(config);

export const createUserRecord = async (item, tableName) => {
  try {
    const timeStamp = new Date().toISOString();
    const params = {
      TableName: tableName,
      Item: {
        ...item,
        createdAt: timeStamp,
        updatedAt: timeStamp,
      },
    };
    console.log({ params, client });

    const input = {};
    const command = new ListTablesCommand(input);
    const response = await client.send(command);

    return response;
  } catch (err) {
    console.error("response error", { err });
    return err;
  }
};
