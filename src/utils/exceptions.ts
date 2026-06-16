import { HttpCode } from './httpCodes'

export class AppError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied: You do not have permission to perform this action') {
    super(message, HttpCode.FORBIDDEN)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'The requested resource could not be found') {
    super(message, HttpCode.NOT_FOUND)
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'An unexpected internal server error occurred') {
    super(message, HttpCode.INTERNAL_SERVER_ERROR)
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'The request was invalid or could not be understood') {
    super(message, HttpCode.BAD_REQUEST)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication credentials were missing or invalid') {
    super(message, HttpCode.UNAUTHORIZED)
  }
}
