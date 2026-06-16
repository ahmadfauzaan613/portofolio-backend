import { NextFunction, Request, Response } from 'express'
import * as authService from '../services/authService'
import { sendSuccess, sendError } from '../utils/responseHelper'

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body
    const { user, token } = await authService.login(username, password)
    const isProd = process.env.NODE_ENV === 'production'

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    })

    return sendSuccess(res, 'Login successful', { user, token })
  } catch (error) {
    next(error)
  }
}

export const handleLogout = (req: Request, res: Response) => {
  const isProd = process.env.NODE_ENV === 'production'
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  })
  return sendSuccess(res, 'Logged out successfully')
}

export const handleUpdatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body

    const userId = (req as any).user.id

    if (!oldPassword || !newPassword) {
      return sendError(res, 'Both old and new password are required', 400)
    }

    await authService.changePassword(userId, oldPassword, newPassword)

    return sendSuccess(res, 'Password updated successfully')
  } catch (error: any) {
    next(error)
  }
}

export const handleMe = async (req: Request, res: Response) => {
  const user = await authService.getMe((req as any).user.id)
  return sendSuccess(res, 'Authorized', { user })
}
