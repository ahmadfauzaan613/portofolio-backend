import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { sendError } from '../utils/responseHelper'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token

  if (!token) {
    return sendError(res, 'Unauthorized: No session cookie found', 401)
  }

  try {
    const secret = process.env.JWT_SECRET as string
    const decoded = jwt.verify(token, secret)
    ;(req as any).user = decoded
    next()
  } catch (error) {
    return sendError(res, 'Invalid or expired session', 401)
  }
}
