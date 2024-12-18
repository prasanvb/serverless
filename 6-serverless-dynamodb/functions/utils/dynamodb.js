import {
  DynamoDBClient,
  ListTablesCommand,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
  ScanCommand,
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

    return { ...response, Items: items };
  } catch (error) {
    console.error("Error querying items by attribute:", error);
    throw error;
  }
};

export const queryByCreatedAtIndex = async (item, tableName) => {
  const { createdAt, country, firstname } = item;

  const params = firstname
    ? {
        TableName: tableName,
        IndexName: "createdAtIndex",
        KeyConditionExpression: "country = :country AND createdAt > :createdAt",
        FilterExpression: "begins_with(firstname, :firstname)",
        ExpressionAttributeValues: {
          ":createdAt": { S: createdAt },
          ":country": { S: country },
          ":firstname": { S: firstname },
        },
        ReturnConsumedCapacity: "TOTAL",
      }
    : {
        TableName: tableName,
        IndexName: "createdAtIndex",
        KeyConditionExpression: "country = :country AND createdAt > :createdAt",
        ExpressionAttributeValues: {
          ":createdAt": { S: createdAt },
          ":country": { S: country },
        },
        ReturnConsumedCapacity: "TOTAL",
      };

  try {
    const command = new QueryCommand(params);
    const response = await client.send(command);
    const items = response.Items?.map((item) => unmarshall(item)) || [];

    console.log("queryUserCreatedAtIndex:", items);

    return { ...response, Items: items };
  } catch (error) {
    console.error("Error querying items by Global Secondary Index:", JSON.stringify(error, null, 2));
    throw error;
  }
};

export const scanCreatedAtIndex = async (item, tableName) => {
  const { createdAt, country, firstname } = item;

  const params = {
    TableName: tableName,
    IndexName: "createdAtIndex",
    FilterExpression: "country = :country AND createdAt > :createdAt AND begins_with(firstname, :firstname)",
    ExpressionAttributeValues: {
      ":createdAt": { S: createdAt },
      ":country": { S: country },
      ":firstname": { S: firstname },
    },
    ReturnConsumedCapacity: "TOTAL",
  };

  try {
    const command = new ScanCommand(params);
    const response = await client.send(command);
    const items = response.Items?.map((item) => unmarshall(item)) || [];

    console.log("scanCreatedAtIndex:", items);

    return { ...response, Items: items };
  } catch (error) {
    console.error("Error scanning items by Global Secondary Index:", JSON.stringify(error, null, 2));
    throw error;
  }
};
