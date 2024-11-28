import { success, error } from "../utils/response.js";
import { createUserRecord, getUserRecord } from "../utils/dynamodb.js";

export const createUser = async (event) => {
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

export const getUser = async (event) => {
  const { USERS_TABLE } = process.env;
  console.log({ event }, event.pathParameters.email);
  const email = event?.pathParameters?.email ?? "vague@gmail.com";

  try {
    const res = await getUserRecord(email, USERS_TABLE);

    console.log("getUserRecord response", { res });

    return { ...success, body: JSON.stringify(res) };
  } catch (err) {
    console.error("getUserRecord error", { err });
    return { ...error, body: JSON.stringify(err) };
  }
};
