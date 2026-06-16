import { NextFunction, Request, Response } from 'express'
import * as service from '../services/categoryService'
import { sendSuccess } from '../utils/responseHelper'
import { BadRequestError } from '../utils/exceptions'

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await service.getCategoryList()
    return sendSuccess(res, 'Categories fetched successfully', categories)
  } catch (e: any) {
    next(e)
  }
}

export const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body
    if (!name) throw new BadRequestError('Nama kategori wajib diisi')
    const result = await service.saveCategory(name)
    return sendSuccess(res, 'Category created successfully', result, 201)
  } catch (e: any) {
    next(e)
  }
}

export const handleUpdateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name } = req.body
    if (!name) throw new BadRequestError('Nama kategori wajib diisi')

    const result = await service.updateCategory(Number(id), name)
    return sendSuccess(res, 'Category updated successfully', result)
  } catch (e: any) {
    next(e)
  }
}

export const handleDeleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    await service.deleteCategory(Number(id))
    return sendSuccess(res, 'Category deleted successfully')
  } catch (e: any) {
    next(e)
  }
}
