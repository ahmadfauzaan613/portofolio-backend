import fs from 'fs'
import path from 'path'
import pool from '../config/database'
import { UPLOAD_PATH } from '../config/multer'
import { PortfolioImageType } from '../models/Portfolio'
import * as imageRepo from '../repository/portfolioImageRepository'
import * as repo from '../repository/portfolioRepository'
import { formatPaginationResponse, getPaginationData } from '../utils/paginationHelper'

const deletePhysicalFile = (fileName: string) => {
  const uploadPath = process.env.UPLOAD_PATH || ''
  const fullPath = path.join(uploadPath, fileName)
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
}

const resolveImages = async (
  portfolioId: number,
  fallback: string[],
  type: 'all_image' | 'logo'
): Promise<string[]> => {
  const images = await imageRepo.findByPortfolioAndType(portfolioId, type)

  if (images.length > 0) {
    return images.map(img => img.filename)
  }

  return Array.isArray(fallback) ? fallback : []
}

const replaceImagesTx = async (
  client: any,
  portfolioId: number,
  type: PortfolioImageType,
  newFiles: string[] | undefined,
  filesToDelete: string[]
) => {
  if (!Array.isArray(newFiles) || newFiles.length === 0) return

  // ambil image lama
  const existingImages = await imageRepo.findByPortfolioAndType(portfolioId, type)

  // tandai file lama untuk dihapus SETELAH commit
  existingImages.forEach(img => filesToDelete.push(img.filename))

  // hapus DB record lama
  await imageRepo.deleteByPortfolioAndType(portfolioId, type)

  // insert DB record baru
  await imageRepo.insertMany(
    newFiles.map(filename => ({
      portfolio_id: portfolioId,
      type,
      filename,
    }))
  )
}

export const createPortfolio = async (data: any) => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // =========================
    // 1. Insert portfolio (metadata)
    // =========================
    const portfolio = await repo.create({
      ...data,
      all_image: [], // legacy JSON dikosongkan
      logo: [],
    })

    const portfolioId = portfolio.id

    // =========================
    // 2. Insert all_image → table baru
    // =========================
    if (Array.isArray(data.all_image) && data.all_image.length > 0) {
      await imageRepo.insertMany(
        data.all_image.map((filename: string) => ({
          portfolio_id: portfolioId,
          type: 'all_image',
          filename,
        }))
      )
    }

    // =========================
    // 3. Insert logo → table baru
    // =========================
    if (Array.isArray(data.logo) && data.logo.length > 0) {
      await imageRepo.insertMany(
        data.logo.map((filename: string) => ({
          portfolio_id: portfolioId,
          type: 'logo',
          filename,
        }))
      )
    }

    await client.query('COMMIT')
    return await getPortfolioById(portfolioId)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export const getAllPortfolios = async (page: number, limit: number, type?: string) => {
  const { limit: l, offset } = getPaginationData(page, limit)
  const { data, total } = await repo.findAll(l, offset, type)

  const enriched = await Promise.all(
    data.map(async (item: any) => ({
      ...item,
      all_image: await resolveImages(item.id, item.all_image, 'all_image'),
      logo: await resolveImages(item.id, item.logo, 'logo'),
    }))
  )

  return formatPaginationResponse(enriched, total, page, limit)
}

export const updatePortfolio = async (id: number, newData: any) => {
  const client = await pool.connect()

  // simpan file lama yang AKAN dihapus (setelah commit)
  const filesToDelete: string[] = []

  try {
    await client.query('BEGIN')

    const existing = await repo.findById(id)
    if (!existing) throw new Error('Portfolio not found')

    const updatePayload: any = {}

    // =========================
    // 1. Metadata
    // =========================
    if (newData.title !== undefined) updatePayload.title = newData.title
    if (newData.short_desc !== undefined) updatePayload.short_desc = newData.short_desc
    if (newData.description !== undefined) updatePayload.description = newData.description
    if (newData.link !== undefined) updatePayload.link = newData.link
    if (newData.category !== undefined) updatePayload.category = newData.category

    // =========================
    // 2. image_banner (replace)
    // =========================
    if (newData.image_banner && newData.image_banner !== existing.image_banner) {
      if (existing.image_banner) {
        filesToDelete.push(existing.image_banner)
      }
      updatePayload.image_banner = newData.image_banner
    }

    // =========================
    // 3. all_image → table baru
    // =========================
    await replaceImagesTx(client, id, 'all_image', newData.all_image, filesToDelete)

    // =========================
    // 4. logo → table baru
    // =========================
    await replaceImagesTx(client, id, 'logo', newData.logo, filesToDelete)

    // =========================
    // 5. Update portfolio metadata
    // =========================
    if (Object.keys(updatePayload).length > 0) {
      await repo.update(id, updatePayload)
    }

    await client.query('COMMIT')

    // =========================
    // 6. Hapus file fisik SETELAH commit
    // =========================
    filesToDelete.forEach(file => {
      const fullPath = path.join(UPLOAD_PATH, file)
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
    })

    return await getPortfolioById(id)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export const deletePortfolio = async (id: number) => {
  const existing = await repo.findById(id)
  if (!existing) return

  // =========================
  // 1. Hapus image_banner
  // =========================
  if (existing.image_banner) {
    deletePhysicalFile(existing.image_banner)
  }

  // =========================
  // 2. Ambil semua image dari table baru
  // =========================
  const allImages = [
    ...(await imageRepo.findByPortfolioAndType(id, 'all_image')),
    ...(await imageRepo.findByPortfolioAndType(id, 'logo')),
  ]

  // =========================
  // 3. Hapus file fisik
  // =========================
  allImages.forEach(img => deletePhysicalFile(img.filename))

  // =========================
  // 4. Hapus portfolio (CASCADE DB)
  // =========================
  await repo.remove(id)
}

export const getPortfolioById = async (id: number) => {
  const result = await repo.findById(id)
  if (!result) throw new Error('Portfolio not found')

  return {
    ...result,
    all_image: await resolveImages(id, result.all_image, 'all_image'),
    logo: await resolveImages(id, result.logo, 'logo'),
  }
}
