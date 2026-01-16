import pool from '../config/database'

export const create = async (data: any) => {
  const query = `
    INSERT INTO api_logs (method, path, status_code, ip_address, user_agent, execution_time, payload)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `
  const values = [
    data.method,
    data.path,
    data.status_code,
    data.ip_address,
    data.user_agent,
    data.execution_time,
    data.payload,
  ]
  const res = await pool.query(query, values)
  return res.rows[0]
}

export const findAll = async (limit: number, offset: number) => {
  const query = `SELECT * FROM api_logs ORDER BY created_at DESC LIMIT $1 OFFSET $2`
  const countQuery = `SELECT COUNT(id) FROM api_logs`

  const [res, countRes] = await Promise.all([
    pool.query(query, [limit, offset]),
    pool.query(countQuery),
  ])

  return {
    data: res.rows,
    total: parseInt(countRes.rows[0].count),
  }
}

export const clearAllLogs = async () => {
  const query = `TRUNCATE TABLE api_logs RESTART IDENTITY`
  await pool.query(query)
  return true
}
