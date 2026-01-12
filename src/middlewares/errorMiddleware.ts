import { NextFunction, Request, Response } from 'express'
import { HttpCode } from '../utils/httpCodes'
import { sendError } from '../utils/responseHelper'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || HttpCode.INTERNAL_SERVER_ERROR
  const message = err.message || 'Internal Server Error'

  console.error(`[Error] ${req.method} ${req.url} : ${message}`)

  return sendError(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? err.stack : null
  )
}
