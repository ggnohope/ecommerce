import { STATUS_CODE } from "../utils/statusCode";
import { REASON_STATUS_CODE } from "../utils/reasonStatusCode";

export class ErrorResponse extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(
    message: string = REASON_STATUS_CODE.NOT_FOUND,
    statusCode: number = STATUS_CODE.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(
    message: string = REASON_STATUS_CODE.BAD_REQUEST,
    statusCode: number = STATUS_CODE.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

export class UnauthorizedError extends ErrorResponse {
  constructor(
    message: string = REASON_STATUS_CODE.UNAUTHORIZED,
    statusCode: number = STATUS_CODE.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(
    message: string = REASON_STATUS_CODE.FORBIDDEN,
    statusCode: number = STATUS_CODE.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

export class ConflictError extends ErrorResponse {
  constructor(
    message: string = REASON_STATUS_CODE.CONFLICT,
    statusCode: number = STATUS_CODE.CONFLICT
  ) {
    super(message, statusCode);
  }
}

export class InternalServerError extends ErrorResponse {
  constructor(
    message: string = REASON_STATUS_CODE.INTERNAL_SERVER_ERROR,
    statusCode: number = STATUS_CODE.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode);
  }
}
