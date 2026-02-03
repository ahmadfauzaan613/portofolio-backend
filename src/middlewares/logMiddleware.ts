import { NextFunction, Request, Response } from 'express'
import * as logService from '../services/logService'

export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()

  res.on('finish', () => {
    const excludedPaths = ['/portfolio/v1/logs/cleanup', '/portfolio/v1/logs']

    if (excludedPaths.includes(req.originalUrl) || req.path.includes('/logs')) {
      return
    }

    const duration = Date.now() - start
    const logPayload = {
      method: req.method,
      path: req.originalUrl,
      status_code: res.statusCode,
      ip_address: req.ip,
      user_agent: req.get('user-agent'),
      execution_time: `${duration}ms`,
      payload: req.method !== 'GET' ? JSON.stringify(req.body) : null,
    }

    logService.storeLog(logPayload).catch(err => {
      console.error('❌ Logger Failure:', err.message)
    })
  })

  next()
}
