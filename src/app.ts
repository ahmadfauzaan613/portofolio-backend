import express, { Application } from 'express'
import { errorHandler } from './middlewares/errorMiddleware'
import profileRoutes from './routes/profileRoutes'

import { Request, Response } from 'express'
import { HttpCode } from './utils/httpCodes'
import { sendError } from './utils/responseHelper'

const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1', profileRoutes)

// FALLBACK ROUTE: Tangkap rute yang tidak terdaftar
app.use((req: Request, res: Response) => {
  return sendError(res, 'The requested resource was not found', HttpCode.NOT_FOUND)
})

// GLOBAL ERROR HANDLER (tetap paling bawah)
app.use(errorHandler)

export default app
