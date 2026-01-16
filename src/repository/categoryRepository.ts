import pool from '../config/database'

export const findAll = async () => {
  const query = `SELECT id, name as category FROM categories ORDER BY name ASC`
  const res = await pool.query(query)
  return res.rows
}

export const create = async (name: string) => {
  const query = `INSERT INTO categories (name) VALUES ($1) RETURNING name as category`
  const res = await pool.query(query, [name])
  return res.rows[0]
}
export const update = async (id: number, name: string) => {
  const query = `UPDATE categories SET name = $1 WHERE id = $2 RETURNING id, name as category`
  const res = await pool.query(query, [name, id])
  return res.rows[0]
}

export const remove = async (id: number) => {
  const query = `DELETE FROM categories WHERE id = $1 RETURNING id, name as category`
  const res = await pool.query(query, [id])
  return res.rows[0]
}

export const findById = async (id: number) => {
  const res = await pool.query('SELECT * FROM categories WHERE id = $1', [id])
  return res.rows[0]
}
