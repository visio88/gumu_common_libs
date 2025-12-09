//db models
import * as COMMON_MODELS from "./database/models";
import connectDatabase from "./database/dbConnect";
//utils
import * as ALLOWED_RESOURCES from "./utils/allowed-resources";
import logger from "./utils/logger";
import { enums as ENUMS } from "./utils/enum";
import {
  generateToken,
  verifyToken,
  verifyTokenBlacklist,
  verifyTokenExpire,
} from "./utils/auth";
import {
  emailValidator,
  verifyPassword,
  handleMongoValidationError,
} from "./utils/validators";
import {
  passwordGenerator,
  uniqueCodeGenerator,
} from "./utils/unique-code-generators";
import { getPaginationQuery } from "./utils/generate-paginated-query";

//libs
import * as APPLICATION_CONST from "./libs/application-const";
import * as SYSTEM_CONST from "./libs/const";
import * as HTTP_ERRORS from "./libs/error/HttpErrors";
import { httpStatusCodes } from "./libs/error/httpStatusCodes";
import BaseError from "./libs/error/BaseError";
import buildResponse, { buildErrorResponse } from "./libs/response";

//default
const hello = () => {
  console.log("Hello From iPass node modules!!!");
};
export default hello;

//token util functions
const authUtil = {
  generateToken,
  verifyToken,
  verifyTokenBlacklist,
  verifyTokenExpire,
};

export {
  COMMON_MODELS,
  logger,
  ENUMS,
  APPLICATION_CONST,
  SYSTEM_CONST,
  HTTP_ERRORS,
  httpStatusCodes as HTTP_STATUS_CODES,
  BaseError,
  authUtil,
  ALLOWED_RESOURCES,
  buildResponse,
  buildErrorResponse,
  connectDatabase,
  emailValidator,
  verifyPassword,
  handleMongoValidationError,
  passwordGenerator,
  uniqueCodeGenerator,
  getPaginationQuery,
};
