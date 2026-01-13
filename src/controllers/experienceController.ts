import { NextFunction, Request, Response } from 'express'
import * as experienceService from '../services/experienceService'
import { HttpCode } from '../utils/httpCodes'
import { sendSuccess } from '../utils/responseHelper'

export const addExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await experienceService.createExperience(req.body)
    return sendSuccess(res, 'Experience added successfully', result, HttpCode.CREATED)
  } catch (error) {
    next(error)
  }
}

export const listExperiences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Reusable parsing logic
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10)

    const result = await experienceService.getAllExperiences(page, limit)

    return sendSuccess(res, 'Experiences retrieved successfully', result)
  } catch (error) {
    next(error)
  }
}
