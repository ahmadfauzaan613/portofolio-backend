import pool from '../config/database'

export const create = async (data: any) => {
  const query = `
    INSERT INTO portfolios (title, image_banner, short_desc, description, link, all_image, logo, category)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, title, image_banner, short_desc, description, link, all_image, logo, category`

  const values = [
    data.title,
    data.image_banner,
    data.short_desc,
    data.description,
    data.link,
    JSON.stringify(data.all_image),
    JSON.stringify(data.logo),
    data.category,
  ]
  const res = await pool.query(query, values)
  return res.rows[0]
}

export const findAll = async (limit: number, offset: number, category?: string) => {
  let query = `
    SELECT id, image_banner, short_desc, description, link, all_image, logo, category, title
    FROM portfolios`
  const values: any[] = [limit, offset]

  if (category) {
    query += ` WHERE category = $3`
    values.push(category)
  }

  query += ` ORDER BY created_at DESC LIMIT $1 OFFSET $2`
  const res = await pool.query(query, values)

  const countQuery = category
    ? `SELECT COUNT(id) FROM portfolios WHERE category = $1`
    : `SELECT COUNT(id) FROM portfolios`
  const countRes = await pool.query(countQuery, category ? [category] : [])

  return { data: res.rows, total: parseInt(countRes.rows[0].count) }
}

export const findById = async (id: number) => {
  const query = `SELECT id, image_banner, short_desc, title, description, link, all_image, logo, category FROM portfolios WHERE id = $1`
  const res = await pool.query(query, [id])
  return res.rows[0]
}

export const update = async (id: number, data: any) => {
  const keys = Object.keys(data)
  const values = Object.values(data).map(val => (Array.isArray(val) ? JSON.stringify(val) : val))

  const setQuery = keys.map((key, i) => `${key} = $${i + 2}`).join(', ')
  const query = `UPDATE portfolios SET ${setQuery} WHERE id = $1 RETURNING *`

  const res = await pool.query(query, [id, ...values])
  return res.rows[0]
}

export const remove = async (id: number) => {
  return await pool.query(`DELETE FROM portfolios WHERE id = $1`, [id])
}
