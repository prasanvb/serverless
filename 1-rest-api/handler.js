"use strict";

module.exports.helloWorld = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  // console.log({ event, context });
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    },
    body: JSON.stringify({
      message: "Rest Api function executed successfully!",
      input: event,
    }),
  };

  callback(null, response);

  setTimeout(function () {
    console.log("Timeout completed.");
  }, 5000);
};
