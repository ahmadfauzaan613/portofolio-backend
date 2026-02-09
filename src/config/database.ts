import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

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
