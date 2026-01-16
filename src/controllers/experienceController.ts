import { NextFunction, Request, Response } from 'express'
import * as experienceService from '../services/experienceService'
import { HttpCode } from '../utils/httpCodes'
import { sendError, sendSuccess } from '../utils/responseHelper'

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
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10)

    const result = await experienceService.getAllExperiences(page, limit)

    return sendSuccess(res, 'Experiences retrieved successfully', result)
  } catch (error) {
    next(error)
  }
}

export const handleUpdateExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await experienceService.updateExperience(Number(id), req.body)
    return sendSuccess(res, 'Experience updated successfully', result)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update experience', 400)
  }
}

export const handleDeleteExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await experienceService.deleteExperience(Number(id))
    return sendSuccess(res, 'Experience deleted successfully')
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete experience', 400)
  }
}

export const handleGetExperienceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // Konversi id ke number
    const result = await experienceService.getExperienceById(Number(id))

    return sendSuccess(res, 'Experience details retrieved successfully', result)
  } catch (error) {
    next(error)
  }
}
