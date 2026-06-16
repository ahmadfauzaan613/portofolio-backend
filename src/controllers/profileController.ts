import { NextFunction, Request, Response } from 'express'
import * as profileService from '../services/profileService'
import { sendSuccess } from '../utils/responseHelper'

export const handleCreateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await profileService.createFullProfile(req.body)
    return sendSuccess(res, 'Profile created successfully', result, 201)
  } catch (error: any) {
    next(error)
  }
}

export const handleUpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await profileService.updateFullProfile(Number(id), req.body)
    return sendSuccess(res, 'Profile updated successfully', result)
  } catch (error: any) {
    next(error)
  }
}

export const handleDeleteProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    await profileService.deleteProfile(Number(id))
    return sendSuccess(res, 'Profile deleted successfully')
  } catch (error: any) {
    next(error)
  }
}

export const handleGetLatestProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await profileService.getLatestProfile()
    return sendSuccess(res, 'Latest profile fetched successfully', result)
  } catch (error: any) {
    next(error)
  }
}

export const handleUploadResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await profileService.uploadResumeFile(req.file)
    return sendSuccess(res, 'Resume uploaded successfully', result, 201)
  } catch (error: any) {
    next(error)
  }
}
