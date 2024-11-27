import { DynamoDBClient, ListTablesCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";

const config = {
  region: "us-west-2",
};

const client = new DynamoDBClient(config);

export const ListTables = async (item, tableName) => {
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

export const createUserRecord = async (item, tableName) => {
  try {
    const timeStamp = new Date().toISOString();

    // Ensure `item` attributes are correctly formatted
    const formattedItem = Object.entries(item).reduce((acc, [key, value]) => {
      acc[key] = { S: String(value) }; // Assuming all values are strings; adjust for numbers or other types
      return acc;
    }, {});

    // Add createdAt and updatedAt timestamps
    formattedItem.createdAt = { S: timeStamp };
    formattedItem.updatedAt = { S: timeStamp };

    const params = {
      TableName: tableName,
      Item: formattedItem,
    };

    console.log({ params });

    const command = new PutItemCommand(params);
    const response = await client.send(command);

    return response;
  } catch (err) {
    console.error("PutItemCommand error", { err });
    return err;
  }
};
