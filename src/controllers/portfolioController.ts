import { NextFunction, Request, Response } from 'express'
import * as service from '../services/portfolioService'
import { sendSuccess } from '../utils/responseHelper'

const parseArrayBody = (value: any): string[] | undefined => {
  if (value === undefined || value === null) return undefined
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    if (value.trim() === '') return []
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        return JSON.parse(value)
      } catch (err) {
        // ignore and fallback
      }
    }
    return value.split(',').map(s => s.trim())
  }
  return undefined
}

export const addPortfolio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as any

    const payload = {
      title: req.body.title,
      short_desc: req.body.short_desc,
      description: req.body.description,
      link: req.body.link,
      category: req.body.category,
    }

    const filePayload = {
      imageBanner: files?.imageBanner ? files.imageBanner[0] : null,
      allImage: files?.allImage || [],
      logo: files?.logo || [],
    }

    const result = await service.createPortfolio(payload, filePayload)
    return sendSuccess(res, 'Portfolio created', result, 201)
  } catch (e) {
    next(e)
  }
}

export const fetchAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = req.query.type as string
    const page = parseInt(req.query.page as string) || 1
    const size = parseInt(req.query.size as string) || 10

    const result = await service.getAllPortfolios(page, size, type)

    return sendSuccess(res, 'Retrieved successfully', result)
  } catch (e) {
    next(e)
  }
}

export const updatePortfolio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const files = req.files as any

    const updateData: any = {}
    if (req.body.title !== undefined) updateData.title = req.body.title
    if (req.body.short_desc !== undefined) updateData.short_desc = req.body.short_desc
    if (req.body.description !== undefined) updateData.description = req.body.description
    if (req.body.category !== undefined) updateData.category = req.body.category
    if (req.body.link !== undefined) updateData.link = req.body.link

    const existingAllImage = parseArrayBody(req.body.existing_all_image)
    const existingLogo = parseArrayBody(req.body.existing_logo)

    const filePayload = {
      imageBanner: files?.imageBanner ? files.imageBanner[0] : null,
      allImage: files?.allImage || [],
      logo: files?.logo || [],
    }

    const result = await service.updatePortfolio(Number(id), updateData, filePayload, {
      existing_all_image: existingAllImage,
      existing_logo: existingLogo,
    })
    return sendSuccess(res, 'Portfolio updated successfully', result)
  } catch (e) {
    next(e)
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.deletePortfolio(Number(req.params.id))
    return sendSuccess(res, 'Deleted successfully')
  } catch (e) {
    next(e)
  }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await service.getPortfolioById(Number(id))
    return sendSuccess(res, 'Portfolio retrieved successfully', result)
  } catch (e) {
    next(e)
  }
}
