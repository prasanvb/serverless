import { success } from "../utils/response.js";

export const createUser = async (event, context) => {
  const { USERS_TABLE } = process.env;
  const body = JSON.parse(event?.body);

  console.log({ USERS_TABLE, body });

  return success;
};
