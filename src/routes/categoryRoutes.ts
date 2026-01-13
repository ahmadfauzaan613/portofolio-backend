import { Router } from 'express'
import * as ctrl from '../controllers/categoryController'

const router = Router()

router.get('/categories', ctrl.list)
router.post('/categories', ctrl.add)

export default router
