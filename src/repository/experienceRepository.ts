import pool from '../config/database'
import { Experience } from '../models/Experience'

export const create = async (data: Experience): Promise<Experience> => {
  const query = `
        INSERT INTO experiences (company, role, description, location, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, company, role, description, location, start_date, end_date, created_at;
    `

  const values = [
    data.company,
    data.role,
    data.description,
    data.location,
    data.start_date,
    data.end_date,
  ]

  const result = await pool.query(query, values)
  return result.rows[0]
}

export const findAll = async (
  limit: number,
  offset: number
): Promise<{ data: Experience[]; total: number }> => {
  const dataQuery = `
        SELECT id, company, role, description, location, start_date, end_date, created_at
        FROM experiences
        ORDER BY id DESC
        LIMIT $1 OFFSET $2;
    `

  const countQuery = `SELECT COUNT(id) FROM experiences;`

  const [dataRes, countRes] = await Promise.all([
    pool.query(dataQuery, [limit, offset]),
    pool.query(countQuery),
  ])

  return {
    data: dataRes.rows,
    total: parseInt(countRes.rows[0].count),
  }
}

export const findById = async (id: number): Promise<Experience | null> => {
  const query = `
    SELECT id, company, role, description, location, start_date, end_date, created_at
    FROM experiences
    WHERE id = $1;
  `
  const result = await pool.query(query, [id])
  return result.rows[0] || null
}

export const update = async (id: number, data: Partial<Experience>): Promise<Experience | null> => {
  const query = `
    UPDATE experiences
    SET company = $1, role = $2, description = $3, location = $4, start_date = $5, end_date = $6
    WHERE id = $7
    RETURNING id, company, role, description, location, start_date, end_date, created_at;
  `
  const values = [
    data.company,
    data.role,
    data.description,
    data.location,
    data.start_date,
    data.end_date,
    id,
  ]

  const result = await pool.query(query, values)
  return result.rows[0] || null
}

export const remove = async (id: number): Promise<Experience | null> => {
  const query = `
    DELETE FROM experiences
    WHERE id = $1
    RETURNING id, company, role, description, location, start_date, end_date, created_at;
  `
  const result = await pool.query(query, [id])
  return result.rows[0] || null
}
