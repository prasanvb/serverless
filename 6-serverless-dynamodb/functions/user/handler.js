module.exports.createUser = async (event, context) => {
  console.log({ event, context });

  const response = {
    statusCode: 200,
    isBase64Encoded: false,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      message: "Hello from the user function - dynamodb",
      inputEvent: event,
    }),
  };

  return response;
};
