import { Router } from 'express'
import * as ctrl from '../controllers/authController'
import { authenticate } from '../middlewares/authMiddleware'

const router = Router()

router.post('/auth/login', ctrl.handleLogin)
router.post('/auth/logout', ctrl.handleLogout)
router.put('/auth/update-password', authenticate, ctrl.handleUpdatePassword)

export default router
