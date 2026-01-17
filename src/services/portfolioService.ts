import fs from 'fs'
import path from 'path'
import { UPLOAD_PATH } from '../config/multer'
import * as repo from '../repository/portfolioRepository'
import { formatPaginationResponse, getPaginationData } from '../utils/paginationHelper'

const deletePhysicalFile = (fileName: string) => {
  const uploadPath = process.env.UPLOAD_PATH || ''
  const fullPath = path.join(uploadPath, fileName)
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
}

export const createPortfolio = (data: any) => repo.create(data)

export const getAllPortfolios = async (page: number, limit: number, type?: string) => {
  const { limit: l, offset } = getPaginationData(page, limit)
  const { data, total } = await repo.findAll(l, offset, type)
  return formatPaginationResponse(data, total, page, limit)
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

export const getPortfolioById = async (id: number) => {
  const result = await repo.findById(id)
  if (!result) throw new Error('Portfolio not found')
  return result
}
