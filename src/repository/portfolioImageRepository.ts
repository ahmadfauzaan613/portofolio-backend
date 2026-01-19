import pool from '../config/database'
import { ICreatePortfolioImage, PortfolioImageType } from '../models/Portfolio'

export const insertMany = async (images: ICreatePortfolioImage[]) => {
  if (images.length === 0) return

  const values: any[] = []
  const placeholders = images.map((img, i) => {
    const baseIndex = i * 3
    values.push(img.portfolio_id, img.type, img.filename)
    return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`
  })

  const query = `
    INSERT INTO portfolio_images (portfolio_id, type, filename)
    VALUES ${placeholders.join(', ')}
  `
  await pool.query(query, values)
}

export const findByPortfolioAndType = async (portfolioId: number, type: PortfolioImageType) => {
  const query = `
    SELECT id, filename
    FROM portfolio_images
    WHERE portfolio_id = $1 AND type = $2
  `
  const res = await pool.query(query, [portfolioId, type])
  return res.rows
}

export const deleteByPortfolioAndType = async (portfolioId: number, type: PortfolioImageType) => {
  await pool.query(`DELETE FROM portfolio_images WHERE portfolio_id = $1 AND type = $2`, [
    portfolioId,
    type,
  ])
}
