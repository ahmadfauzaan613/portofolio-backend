import { NextFunction, Request, Response } from 'express'
import * as service from '../services/categoryService'

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await service.getCategoryList()
    res.json({
      status: 'success',
      data: categories,
    })
  } catch (e) {
    next(e)
  }
}

export const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body
    if (!name) throw new Error('Nama kategori wajib diisi')
    const result = await service.saveCategory(name)
    res.status(201).json({ status: 'success', data: result })
  } catch (e) {
    next(e)
  }
}
