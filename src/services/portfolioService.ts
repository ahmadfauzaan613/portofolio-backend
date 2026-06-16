import pool from '../config/database'
import { PortfolioImageType } from '../models/Portfolio'
import * as imageRepo from '../repository/portfolioImageRepository'
import * as repo from '../repository/portfolioRepository'
import { formatPaginationResponse, getPaginationData } from '../utils/paginationHelper'
import { NotFoundError, BadRequestError } from '../utils/exceptions'
import { uploadFile, deleteFile, getFullUrl, extractKeyFromUrl } from '../utils/s3Storage'

const resolveImages = async (
  portfolioId: number,
  fallback: string[],
  type: 'all_image' | 'logo'
): Promise<string[]> => {
  const images = await imageRepo.findByPortfolioAndType(portfolioId, type)
  const list = images.length > 0 ? images.map(img => img.filename) : (Array.isArray(fallback) ? fallback : [])
  return list.map(img => getFullUrl(img) || '')
}

export const createPortfolio = async (
  data: {
    title: string
    short_desc: string
    description: string
    link?: string
    category: string
  },
  files: {
    imageBanner?: any
    allImage?: any[]
    logo?: any[]
  }
) => {
  if (!data.title) throw new BadRequestError('Title is required')
  if (!data.short_desc) throw new BadRequestError('Short description is required')
  if (!data.description) throw new BadRequestError('Description is required')
  if (!data.category) throw new BadRequestError('Category is required')

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    let bannerKey = ''
    if (files.imageBanner) {
      bannerKey = await uploadFile(files.imageBanner.buffer, files.imageBanner.originalname, 'portfolios/banners')
    }

    const portfolio = await repo.create({
      ...data,
      image_banner: bannerKey,
      all_image: [],
      logo: [],
    })

    const portfolioId = portfolio.id

    if (files.allImage && files.allImage.length > 0) {
      const filenames: string[] = []
      for (const file of files.allImage) {
        const key = await uploadFile(file.buffer, file.originalname, 'portfolios/images')
        filenames.push(key)
      }
      await imageRepo.insertMany(
        filenames.map(filename => ({
          portfolio_id: portfolioId,
          type: 'all_image',
          filename,
        }))
      )
    }

    if (files.logo && files.logo.length > 0) {
      const filenames: string[] = []
      for (const file of files.logo) {
        const key = await uploadFile(file.buffer, file.originalname, 'portfolios/logos')
        filenames.push(key)
      }
      await imageRepo.insertMany(
        filenames.map(filename => ({
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
      image_banner: getFullUrl(item.image_banner),
      all_image: await resolveImages(item.id, item.all_image, 'all_image'),
      logo: await resolveImages(item.id, item.logo, 'logo'),
    }))
  )

  return formatPaginationResponse(enriched, total, page, limit)
}

export const updatePortfolio = async (
  id: number,
  newData: any,
  files: {
    imageBanner?: any
    allImage?: any[]
    logo?: any[]
  },
  options?: {
    existing_all_image?: string[]
    existing_logo?: string[]
  }
) => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const existing = await repo.findById(id)
    if (!existing) throw new NotFoundError('Portfolio not found')

    const updatePayload: any = {}

    if (newData.title !== undefined) updatePayload.title = newData.title
    if (newData.short_desc !== undefined) updatePayload.short_desc = newData.short_desc
    if (newData.description !== undefined) updatePayload.description = newData.description
    if (newData.link !== undefined) updatePayload.link = newData.link
    if (newData.category !== undefined) updatePayload.category = newData.category

    if (files.imageBanner) {
      if (existing.image_banner) {
        await deleteFile(existing.image_banner).catch(err => console.error(`Failed to delete banner:`, err))
      }
      updatePayload.image_banner = await uploadFile(
        files.imageBanner.buffer,
        files.imageBanner.originalname,
        'portfolios/banners'
      )
    }

    if (options?.existing_all_image !== undefined || (files.allImage && files.allImage.length > 0)) {
      const keptKeys = (options?.existing_all_image || [])
        .map(url => extractKeyFromUrl(url))
        .filter(Boolean) as string[]
      
      const currentImages = await imageRepo.findByPortfolioAndType(id, 'all_image')
      const currentKeys = currentImages.map(img => img.filename)

      await imageRepo.deleteByPortfolioAndType(id, 'all_image')

      const uploadedKeys: string[] = []
      if (files.allImage && files.allImage.length > 0) {
        for (const file of files.allImage) {
          const key = await uploadFile(file.buffer, file.originalname, 'portfolios/images')
          uploadedKeys.push(key)
        }
      }

      const finalKeys = [...keptKeys, ...uploadedKeys]
      if (finalKeys.length > 0) {
        await imageRepo.insertMany(
          finalKeys.map(filename => ({
            portfolio_id: id,
            type: 'all_image',
            filename,
          }))
        )
      }

      const keysToDelete = currentKeys.filter(k => !keptKeys.includes(k))
      for (const key of keysToDelete) {
        await deleteFile(key).catch(err => console.error(`Failed to delete portfolio image:`, err))
      }
    }

    if (options?.existing_logo !== undefined || (files.logo && files.logo.length > 0)) {
      const keptKeys = (options?.existing_logo || [])
        .map(url => extractKeyFromUrl(url))
        .filter(Boolean) as string[]
      
      const currentLogos = await imageRepo.findByPortfolioAndType(id, 'logo')
      const currentKeys = currentLogos.map(img => img.filename)

      await imageRepo.deleteByPortfolioAndType(id, 'logo')

      const uploadedKeys: string[] = []
      if (files.logo && files.logo.length > 0) {
        for (const file of files.logo) {
          const key = await uploadFile(file.buffer, file.originalname, 'portfolios/logos')
          uploadedKeys.push(key)
        }
      }

      const finalKeys = [...keptKeys, ...uploadedKeys]
      if (finalKeys.length > 0) {
        await imageRepo.insertMany(
          finalKeys.map(filename => ({
            portfolio_id: id,
            type: 'logo',
            filename,
          }))
        )
      }

      const keysToDelete = currentKeys.filter(k => !keptKeys.includes(k))
      for (const key of keysToDelete) {
        await deleteFile(key).catch(err => console.error(`Failed to delete logo:`, err))
      }
    }

    if (Object.keys(updatePayload).length > 0) {
      await repo.update(id, updatePayload)
    }

    await client.query('COMMIT')
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

  if (existing.image_banner) {
    await deleteFile(existing.image_banner).catch(err => console.error(`Failed to delete banner on cascade:`, err))
  }

  const allImages = [
    ...(await imageRepo.findByPortfolioAndType(id, 'all_image')),
    ...(await imageRepo.findByPortfolioAndType(id, 'logo')),
  ]

  for (const img of allImages) {
    await deleteFile(img.filename).catch(err => console.error(`Failed to delete S3 file on cascade:`, err))
  }

  await repo.remove(id)
}

export const getPortfolioById = async (id: number) => {
  const result = await repo.findById(id)
  if (!result) throw new NotFoundError('Portfolio not found')

  return {
    ...result,
    image_banner: getFullUrl(result.image_banner),
    all_image: await resolveImages(id, result.all_image, 'all_image'),
    logo: await resolveImages(id, result.logo, 'logo'),
  }
}
