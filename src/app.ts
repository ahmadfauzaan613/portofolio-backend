import express, { Application } from 'express'
import { errorHandler } from './middlewares/errorMiddleware'
import categoryRoutes from './routes/categoryRoutes'
import portfolioRoutes from './routes/portfolioRoutes'
import profileRoutes from './routes/profileRoutes'

import { Request, Response } from 'express'
import { HttpCode } from './utils/httpCodes'
import { sendError } from './utils/responseHelper'

import { UPLOAD_PATH } from './config/multer'
import experienceRoutes from './routes/experienceRoutes'

const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1', profileRoutes)
app.use('/api/v1', experienceRoutes)
app.use('/images', express.static(UPLOAD_PATH))
app.use('/api/v1', portfolioRoutes)
app.use('/api/v1', categoryRoutes)

app.use((req: Request, res: Response) => {
  return sendError(res, 'The requested resource was not found', HttpCode.NOT_FOUND)
})

app.use(errorHandler)

export default app
