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

export const handleUpdateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await profileService.updateFullProfile(Number(id), req.body)
    return sendSuccess(res, 'Profile updated successfully', result)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update profile', 400)
  }
}

export const handleDeleteProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await profileService.deleteProfile(Number(id))
    return sendSuccess(res, 'Profile deleted successfully')
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete profile', 400)
  }
}

export const handleGetLatestProfile = async (req: Request, res: Response) => {
  try {
    const result = await profileService.getLatestProfile()
    return sendSuccess(res, 'Latest profile fetched successfully', result)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch profile', 400)
  }
}
