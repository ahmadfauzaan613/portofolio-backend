import { Router } from 'express'
import * as ctrl from '../controllers/logController'
import { authenticate } from '../middlewares/authMiddleware'

const router = Router()
router.get('/logs', authenticate, ctrl.listLogs)
router.delete('/logs/cleanup', authenticate, ctrl.cleanup)

export default router
