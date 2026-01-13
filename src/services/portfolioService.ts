import fs from 'fs'
import path from 'path'
import { UPLOAD_PATH } from '../config/multer'
import * as repo from '../repository/portfolioRepository'

const deletePhysicalFile = (fileName: string) => {
  const uploadPath = process.env.UPLOAD_PATH || ''
  const fullPath = path.join(uploadPath, fileName)
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
}

export const createPortfolio = (data: any) => repo.create(data)

export const getAllPortfolios = async (page: number, size: number, type?: string) => {
  const offset = (page - 1) * size
  return await repo.findAll(size, offset, type)
}

export const updatePortfolio = async (id: number, newData: any) => {
  const existing = await repo.findById(id)
  if (!existing) throw new Error('Portfolio not found')

  const updatePayload: any = { ...newData }

  if (newData.all_image !== undefined) {
    existing.all_image?.forEach((f: string) => {
      const fullPath = path.join(UPLOAD_PATH, f)
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
    })
  }

  if (newData.logo !== undefined) {
    existing.logo?.forEach((f: string) => {
      const fullPath = path.join(UPLOAD_PATH, f)
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
    })
  }

  if (newData.image_banner && newData.image_banner !== existing.image_banner) {
    const oldPath = path.join(UPLOAD_PATH, existing.image_banner)
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
  }

  return await repo.update(id, updatePayload)
}

export const deletePortfolio = async (id: number) => {
  const existing = await repo.findById(id)
  if (existing) {
    ;[existing.image_banner, ...existing.all_image, ...existing.logo].forEach(f => {
      if (f) deletePhysicalFile(f)
    })
  }
  return await repo.remove(id)
}
