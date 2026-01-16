import { NextFunction, Request, Response } from 'express'
import * as logService from '../services/logService'
import { sendSuccess } from '../utils/responseHelper'

export const listLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.max(1, parseInt(req.query.limit as string) || 20)

    const result = await logService.getAllLogs(page, limit)
    return sendSuccess(res, 'Logs retrieved successfully', result)
  } catch (error) {
    next(error)
  }
}

export const cleanup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await logService.deleteAllLogs()
    return sendSuccess(res, 'All logs have been cleared successfully')
  } catch (e) {
    next(e)
  }
}
