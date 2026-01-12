import { Request, Response } from 'express'
import * as profileService from '../services/profileService'
import { sendError, sendSuccess } from '../utils/responseHelper'

export const handleCreateProfile = async (req: Request, res: Response) => {
  try {
    const result = await profileService.createFullProfile(req.body)
    return sendSuccess(res, 'Profile created successfully', result, 201)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create profile', 400)
  }
}
