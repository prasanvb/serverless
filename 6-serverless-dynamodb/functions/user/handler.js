import { success, error } from "../utils/response.js";
import {
  createUserRecord,
  getUserRecord,
  queryUserRecords,
  queryByCreatedAtIndex,
  scanCreatedAtIndex,
} from "../utils/dynamodb.js";
import { sendRawEmail } from "../utils/email.js";

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

export const notifyUser = async (event) => {
  console.log("DynamoDB Stream Event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    console.log("Stream record:", JSON.stringify(record, null, 2));

    const oldItem = record.dynamodb.OldImage;
    const newItem = record.dynamodb.NewImage;

    const { firstname, lastname, email } = newItem;
    const emailId = email.S;
    const subject = "DynamoDB stream event notification";
    const emailBody = `Hello ${firstname.S} ${lastname.S}, 
    
    ${record.eventName} event was successful.
      
    Regards
    AWS SES `;

    if (record.eventName === "INSERT") {
      console.log("New item added:", { newItem });

      try {
        const res = await sendRawEmail(emailId, subject, emailBody);

        console.log("INSERT event, notifyUser response", { res });

        return { ...success, body: JSON.stringify(res) };
      } catch (error) {
        console.error("INSERT event, notifyUser error", { err });

        return { ...error, body: JSON.stringify(err) };
      }
    }

    if (record.eventName === "MODIFY") {
      console.log("Item modified:", { oldItem, newItem });

      try {
        const res = await sendRawEmail(emailId, subject, emailBody);

        console.log("MODIFY event, notifyUser response", { res });

        return { ...success, body: JSON.stringify(res) };
      } catch (error) {
        console.error("MODIFY event, notifyUser error", { err });

        return { ...error, body: JSON.stringify(err) };
      }
    }
  }
};
