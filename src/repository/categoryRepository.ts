import pool from '../config/database'

export const findAll = async () => {
  const query = `SELECT name as category FROM categories ORDER BY name ASC`
  const res = await pool.query(query)
  return res.rows
}

export const create = async (name: string) => {
  const query = `INSERT INTO categories (name) VALUES ($1) RETURNING name as category`
  const res = await pool.query(query, [name])
  return res.rows[0]
}
