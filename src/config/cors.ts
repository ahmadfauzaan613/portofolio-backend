import { CorsOptions } from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const allowedOrigins = process.env.FRONTEND_URL?.split(',').map(origin => origin.trim())

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    if (allowedOrigins?.includes('*') || allowedOrigins?.includes(origin)) {
      return callback(null, true)
    }

    console.warn(`⚠️ [CORS] Blocked request from origin: ${origin}`)
    return callback(new Error(`Not allowed by CORS: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
