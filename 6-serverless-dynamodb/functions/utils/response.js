export const success = {
  statusCode: 200,
  isBase64Encoded: false,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify({
    message: "Lambda function - dynamodb",
  }),
};

export const error = {
  statusCode: 400,
  isBase64Encoded: false,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
};
