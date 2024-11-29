import { success, error } from "../utils/response.js";
import {
  createUserRecord,
  getUserRecord,
  queryUserRecords,
  queryByCreatedAtIndex,
  scanCreatedAtIndex,
} from "../utils/dynamodb.js";

export const createUser = async (event) => {
  const { USERS_TABLE } = process.env;
  const body = JSON.parse(event?.body);

  if (!body) {
    return {
      ...error,
      body: JSON.stringify({
        message: "createUser event body data invalid",
      }),
    };
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
  const email = event?.pathParameters?.email;
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // schema validation
  if (!email || !isValidEmail(email)) {
    return {
      ...error,
      body: JSON.stringify({
        message: "event path parameter invalid",
      }),
    };
  }

  try {
    const res = await getUserRecord(email, USERS_TABLE);

    console.log("getUserRecord response", { res });

    return { ...success, body: JSON.stringify(res) };
  } catch (err) {
    console.error("getUserRecord error", { err });
    return { ...error, body: JSON.stringify(err) };
  }
};

export const queryUsers = async (event) => {
  const { USERS_TABLE } = process.env;
  const body = JSON.parse(event?.body);

  if (!body) {
    return {
      ...error,
      body: JSON.stringify({
        message: "queryUser event body data invalid",
      }),
    };
  }

  try {
    const res = await queryUserRecords(body, USERS_TABLE);

    console.log("queryUserRecords response", { res });

    return { ...success, body: JSON.stringify(res) };
  } catch (err) {
    console.error("queryUserRecords error", { err });
    return { ...error, body: JSON.stringify(err) };
  }
};

export const queryUserCreatedAtIndex = async (event) => {
  const { USERS_TABLE } = process.env;
  const body = JSON.parse(event?.body);

  if (!body) {
    return {
      ...error,
      body: JSON.stringify({
        message: "queryUserCreatedAtIndex event body data invalid",
      }),
    };
  }

  try {
    const res = await queryByCreatedAtIndex(body, USERS_TABLE);

    console.log("queryByCreatedAtIndex response", { res });

    return { ...success, body: JSON.stringify(res) };
  } catch (err) {
    console.error("queryByCreatedAtIndex error", { err });
    return { ...error, body: JSON.stringify(err) };
  }
};

export const scanUserCreatedAtIndex = async (event) => {
  const { USERS_TABLE } = process.env;
  const body = JSON.parse(event?.body);

  if (!body) {
    return {
      ...error,
      body: JSON.stringify({
        message: "scanUserCreatedAtIndex event body data invalid",
      }),
    };
  }

  try {
    const res = await scanCreatedAtIndex(body, USERS_TABLE);

    console.log("scanUserCreatedAtIndex response", { res });

    return { ...success, body: JSON.stringify(res) };
  } catch (err) {
    console.error("scanUserCreatedAtIndex error", { err });
    return { ...error, body: JSON.stringify(err) };
  }
};
