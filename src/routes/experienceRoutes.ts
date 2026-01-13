import { Router } from 'express'
import * as experienceController from '../controllers/experienceController'

const router = Router()

router.post('/create-experiences', experienceController.addExperience)
router.get('/get-all-experiences', experienceController.listExperiences)

export default router
