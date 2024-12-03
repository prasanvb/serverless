"use strict";

module.exports.sample = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    },
    body: JSON.stringify({
      message: "Serverless Environment Variables!",
      TEST_VAR: `${process.env.TEST_VAR}`,
      TEST_VAR_FS: `${process.env.TEST_VAR_FS}`,
      NESTED_TEST_VAR: `${process.env.NESTED_TEST_VAR}`,
      OVERRIDING_TEST_VAR: `${process.env.OVERRIDING_TEST_VAR}`,
      DB_USERNAME_PS: `${process.env.DB_USERNAME_PS}`,
      DECRYPTED_DB_PASSWORD_PS: `${process.env.DECRYPTED_DB_PASSWORD_PS}`,
      ENCRYPTED_DB_PASSWORD_PS: `${process.env.ENCRYPTED_DB_PASSWORD_PS}`,
      DB_ADMIN_USERNAME_JSON: `${process.env.DB_ADMIN_USERNAME_JSON}`,
      DB_ADMIN_PASSWORD_JSON: `${process.env.DB_ADMIN_PASSWORD_JSON}`,
    }),
  };

  callback(null, response);
};
