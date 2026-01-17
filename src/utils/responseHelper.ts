import { Response } from 'express'
import { HttpCode } from './httpCodes'

export const sendSuccess = (
  res: Response,
  message: string,
  data: any = null,
  statusCode: number = 200
) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  })
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
