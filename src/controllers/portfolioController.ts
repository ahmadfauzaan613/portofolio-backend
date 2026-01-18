import { NextFunction, Request, Response } from 'express'
import * as service from '../services/portfolioService'
import { sendSuccess } from '../utils/responseHelper'

export const addPortfolio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as any

    const payload = {
      title: req.body.title,
      image_banner: files?.imageBanner ? files.imageBanner[0].filename : '',
      short_desc: req.body.short_desc,
      description: req.body.description,
      link: req.body.link,
      category: req.body.category,
      all_image: files?.allImage ? files.allImage.map((f: any) => f.filename) : [],
      logo: files?.logo ? files.logo.map((f: any) => f.filename) : [],
    }

    const result = await service.createPortfolio(payload)
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

    const bodyKeys = Object.keys(req.body)

    const updateData: any = {}

    if (req.body.title !== undefined) updateData.title = req.body.title
    if (req.body.short_desc !== undefined) updateData.short_desc = req.body.short_desc
    if (req.body.description !== undefined) updateData.description = req.body.description
    if (req.body.category !== undefined) updateData.category = req.body.category
    if (req.body.link !== undefined) updateData.link = req.body.link

    if (files?.imageBanner) {
      updateData.image_banner = files.imageBanner[0].filename
    }

    // 2. All Image
    if (files?.allImage && files.allImage.length > 0) {
      updateData.all_image = files.allImage.map((f: any) => f.filename)
    } else if (bodyKeys.includes('allImage')) {
      updateData.all_image = []
    }

    // 3. Logo
    if (files?.logo && files.logo.length > 0) {
      updateData.logo = files.logo.map((f: any) => f.filename)
    } else if (bodyKeys.includes('logo')) {
      updateData.logo = []
    }

    const result = await service.updatePortfolio(Number(id), updateData)
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
