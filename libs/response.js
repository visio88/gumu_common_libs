import { httpStatusCodes } from "./error/httpStatusCodes";

export function buildResponse(statusCode, data) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(data),
  };
}

export default buildResponse;
/**
 * Builds error response
 * @param {*} error
 * @returns errorResponse
 */
const buildErrorResponse = (error) => {
  const errorData = {
    statusCode:
      error?.statusCode ||
      (error?.type === "SyntaxError"
        ? httpStatusCodes.BAD_REQUEST
        : httpStatusCodes.INTERNAL_SERVER_ERROR),
    data: error?.statusCode
      ? error
      : {
          message:
            error?.type === "SyntaxError"
              ? "Bad Request !"
              : "Internal Server Error !",
        },
  };
  return {
    statusCode: errorData?.statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(errorData.data),
  };
};

export { buildErrorResponse };
