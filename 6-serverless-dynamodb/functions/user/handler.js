import { success, error } from "../utils/response.js";
import { createUserRecord } from "../utils/dynamodb.js";

export const createUser = async (event, context) => {
  const { USERS_TABLE } = process.env;
  const body = JSON.parse(event?.body);

  if (!body) {
    return;
  }

  try {
    const res = await createUserRecord(body, USERS_TABLE);

    console.log("createUserRecord response", { res });

    return { ...success, body: JSON.stringify(res) };
  } catch (err) {
    console.error("createUserRecord error", { err });
    return { ...error, body: JSON.stringify(err) };
  }
};
