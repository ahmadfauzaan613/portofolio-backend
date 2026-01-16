import pool from '../config/database'

export const findByUsername = async (username: string) => {
  const res = await pool.query('SELECT * FROM users WHERE username = $1', [username])
  return res.rows[0]
}

export const findById = async (id: number) => {
  const res = await pool.query('SELECT * FROM users WHERE id = $1', [id])
  return res.rows[0]
}

export const updatePassword = async (id: number, hashedPass: string) => {
  await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPass, id])
  return true
}
