import BaseError from "./BaseError";
import { httpStatusCodes } from "./httpStatusCodes";

export class NotFoundError extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.NOT_FOUND,
    description = "Not found.",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}

export class BadRequestError extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.BAD_REQUEST,
    description = "Bad Request",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.UNAUTHORIZED,
    description = "Unauthorized",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}

export class ForbiddenError extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.FORBIDDEN,
    description = "Forbidden",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}

export class RequestTimeOutError extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.REQUEST_TIMEOUT,
    description = "Request Timeout",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}

export class InternalServerError extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR,
    description = "Internal server error",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}
