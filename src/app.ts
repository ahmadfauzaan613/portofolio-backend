import express, { Application } from 'express'
import { errorHandler } from './middlewares/errorMiddleware'
import authRoutes from './routes/authRoutes'
import categoryRoutes from './routes/categoryRoutes'
import logRoutes from './routes/logRoutes'
import portfolioRoutes from './routes/portfolioRoutes'
import profileRoutes from './routes/profileRoutes'

import { Request, Response } from 'express'
import { HttpCode } from './utils/httpCodes'
import { sendError } from './utils/responseHelper'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import { corsOptions } from './config/cors'
import { UPLOAD_PATH } from './config/multer'
import { apiLogger } from './middlewares/logMiddleware'
import experienceRoutes from './routes/experienceRoutes'

const app: Application = express()

app.use(cors(corsOptions))
app.use(express.json())

app.use(cookieParser())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(express.json())
app.use(cookieParser())
app.use(apiLogger)
app.use(express.urlencoded({ extended: true }))

app.use('/portfolio/v1', authRoutes)
app.use('/portfolio/v1', profileRoutes)
app.use('/portfolio/v1', experienceRoutes)
app.use('/images', express.static(UPLOAD_PATH))
app.use('/portfolio/v1', portfolioRoutes)
app.use('/portfolio/v1', categoryRoutes)
app.use('/portfolio/v1', logRoutes)

app.use((req: Request, res: Response) => {
  return sendError(res, 'The requested resource was not found', HttpCode.NOT_FOUND)
})

app.use(errorHandler)

export default app
