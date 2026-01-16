import { Router } from 'express'
import * as experienceController from '../controllers/experienceController'
import { authenticate } from '../middlewares/authMiddleware'

const router = Router()

router.post('/experiences', authenticate, experienceController.addExperience)
router.get('/experiences', experienceController.listExperiences)
router.put('/experiences/:id', authenticate, experienceController.handleUpdateExperience)
router.delete('/experiences/:id', authenticate, experienceController.handleDeleteExperience)

export default router
