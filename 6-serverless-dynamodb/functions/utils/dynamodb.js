import { DynamoDBClient, ListTablesCommand, PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";

const config = {
  region: "us-west-2",
};

const client = new DynamoDBClient(config);

export const ListTables = async () => {
  try {
    const input = {};
    const command = new ListTablesCommand(input);
    const response = await client.send(command);

    return response;
  } catch (err) {
    console.error("response error", { err });
    return err;
  }
};

export const getUserRecord = async (email, tableName) => {
  const params = {
    TableName: tableName,
    Key: {
      email: { S: email }, // Replace with your partition key value
    },
    // ProjectionExpression: "STRING_VALUE",
    ReturnConsumedCapacity: "TOTAL",
    ConsistentRead: false,
  };

  try {
    const command = new GetItemCommand(params);
    const response = await client.send(command);

    console.log("Item retrieved successfully:", response);

    return { Item: unmarshall(response.Item), ConsumedCapacity: response.ConsumedCapacity };
  } catch (error) {
    console.error("Error retrieving item:", error);
    throw error;
  }
};

export const createUserRecord = async (item, tableName) => {
  const timeStamp = new Date().toISOString();
  const data = { ...item, createdAt: timeStamp, updatedAt: timeStamp };
  const params = {
    TableName: tableName,
    Item: marshall(data),
  };

  console.log({ params });

  try {
    const command = new PutItemCommand(params);
    const response = await client.send(command);

    return response;
  } catch (err) {
    console.error("PutItemCommand error", { err });
    return err;
  }
};
