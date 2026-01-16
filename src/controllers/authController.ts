import { NextFunction, Request, Response } from 'express'
import * as authService from '../services/authService'
import { sendSuccess } from '../utils/responseHelper'

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body
    const { user, token } = await authService.login(username, password)

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    })

    return sendSuccess(res, 'Login successful', { user })
  } catch (error) {
    next(error)
  }
}

export const handleLogout = (req: Request, res: Response) => {
  res.clearCookie('token')
  return sendSuccess(res, 'Logged out successfully')
}

export const handleUpdatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body

    const userId = (req as any).user.id

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Both old and new password are required' })
    }

    await authService.changePassword(userId, oldPassword, newPassword)

    return sendSuccess(res, 'Password updated successfully')
  } catch (error: any) {
    next(error)
  }
}
