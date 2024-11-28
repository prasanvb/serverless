import {
  DynamoDBClient,
  ListTablesCommand,
  PutItemCommand,
  GetItemCommand,
  ReturnConsumedCapacity,
} from "@aws-sdk/client-dynamodb";

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

    return response;
  } catch (error) {
    console.error("Error retrieving item:", error);
    throw error;
  }
};

export const createUserRecord = async (item, tableName) => {
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

  try {
    const command = new PutItemCommand(params);
    const response = await client.send(command);

    return response;
  } catch (err) {
    console.error("PutItemCommand error", { err });
    return err;
  }
};
