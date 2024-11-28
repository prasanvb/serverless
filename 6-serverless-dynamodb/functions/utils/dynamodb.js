import {
  DynamoDBClient,
  ListTablesCommand,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
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
      email: { S: email }, //  partition key value
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

export const queryUserRecords = async (item, tableName) => {
  const { email, country } = item;

  console.log({ email, country });

  const params = {
    TableName: tableName,
    KeyConditionExpression: "email = :email",
    FilterExpression: "country = :country",
    ExpressionAttributeValues: {
      ":email": { S: email },
      ":country": { S: country },
    },
    ReturnConsumedCapacity: "TOTAL",
  };

  try {
    const command = new QueryCommand(params);
    const response = await client.send(command);
    const items = response.Items?.map((item) => unmarshall(item)) || [];

    console.log("queryUserRecords Items:", items);

    return { Item: items, ConsumedCapacity: response.ConsumedCapacity };
  } catch (error) {
    console.error("Error querying items by attribute:", error);
    throw error;
  }
};
