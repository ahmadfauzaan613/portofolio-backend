import dotenv from 'dotenv'
import { Pool, types } from 'pg'

dotenv.config()

// Force the pg driver to parse PostgreSQL DATE (OID 1082) as a raw string 'YYYY-MM-DD'
// to avoid local timezone conversions and shifting.
types.setTypeParser(1082, (val: string) => val)

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT) || 5432,
})

pool.on('connect', () => {
  console.log('PostgreSQL Database connected successfully')
})

pool.on('error', err => {
  console.error('Unexpected error on idle database client', err)
})

export default pool
