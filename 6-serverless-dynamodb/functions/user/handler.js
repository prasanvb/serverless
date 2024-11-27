import { success, error } from "../utils/response.js";
import { createUserRecord } from "../utils/dynamodb.js";

export const createUser = async (event, context) => {
  const { USERS_TABLE } = process.env;
  // const body = JSON.parse(event?.body);

  // console.log({ USERS_TABLE, body });

  try {
    const res = await createUserRecord({}, USERS_TABLE);

    console.log("createUserRecord handler response", { res });

    return { ...success, body: JSON.stringify(res) };
  } catch (err) {
    console.error("response error handler", { err });
    return { ...error, body: JSON.stringify(err) };
  }
};
