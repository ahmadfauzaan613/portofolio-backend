import { Response } from 'express'
import { HttpCode } from './httpCodes'

export const sendSuccess = (
  res: Response,
  message: string,
  data: any = null,
  statusCode: number = HttpCode.OK
) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  })
}

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = HttpCode.INTERNAL_SERVER_ERROR,
  error: any = null
) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    error,
  })
}
