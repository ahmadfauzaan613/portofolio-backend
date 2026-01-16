import { Router } from 'express'
import * as ctrl from '../controllers/categoryController'
import { authenticate } from '../middlewares/authMiddleware'

const router = Router()

router.get('/categories', ctrl.list)
router.post('/categories', authenticate, ctrl.add)
router.put('/categories/:id', authenticate, ctrl.handleUpdateCategory)
router.delete('/categories/:id', authenticate, ctrl.handleDeleteCategory)

export default router
