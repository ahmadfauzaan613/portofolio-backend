import { CorsOptions } from 'cors'
import dotenv from 'dotenv'

dotenv.config()

export const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
