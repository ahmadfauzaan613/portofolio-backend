import { NextFunction, Request, Response } from 'express'
import { HttpCode } from '../utils/httpCodes'
import { sendError } from '../utils/responseHelper'
import { AppError } from '../utils/exceptions'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || HttpCode.INTERNAL_SERVER_ERROR
  let message = err.message

  // Apply default messages if not set or if they are internal errors
  const isProduction = process.env.NODE_ENV === 'production'
  if (statusCode === HttpCode.INTERNAL_SERVER_ERROR) {
    message = isProduction 
      ? 'An unexpected internal server error occurred' 
      : (err.message || 'Internal Server Error')
  } else if (statusCode === HttpCode.FORBIDDEN && !message) {
    message = 'Access denied: You do not have permission to perform this action'
  } else if (statusCode === HttpCode.NOT_FOUND && !message) {
    message = 'The requested resource could not be found'
  }

  // Professional logging: Log error details and stack trace to server console/logs
  console.error(`[Error] ${req.method} ${req.url} - Status: ${statusCode} - Message: ${message}`)
  if (err.stack) {
    console.error(err.stack)
  }

  return sendError(
    res,
    message,
    statusCode,
    err.errors || null
  )
}
