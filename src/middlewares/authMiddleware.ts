import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../utils/exceptions'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  let token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null

  if (!token) {
    token = req.cookies?.token || null
  }

  if (!token) {
    throw new UnauthorizedError('Unauthorized: No token provided')
  }

  try {
    const secret = process.env.JWT_SECRET as string
    const decoded = jwt.verify(token, secret)
    ;(req as any).user = decoded
    next()
  } catch (error) {
    throw new UnauthorizedError('Unauthorized: Invalid or expired token')
  }
}
