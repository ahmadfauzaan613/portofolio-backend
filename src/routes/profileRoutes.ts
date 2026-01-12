import { Router } from 'express'
import { handleCreateProfile } from '../controllers/profileController'

const router = Router()

router.post('/profiles', handleCreateProfile)

export default router
