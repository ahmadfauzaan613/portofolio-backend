import { Router } from 'express'
import {
  handleCreateProfile,
  handleDeleteProfile,
  handleGetLatestProfile,
  handleUpdateProfile,
} from '../controllers/profileController'
import { authenticate } from '../middlewares/authMiddleware'

const router = Router()

router.post('/profiles', authenticate, handleCreateProfile)

router.put('/profiles/:id', authenticate, handleUpdateProfile)

router.delete('/profiles/:id', authenticate, handleDeleteProfile)

router.get('/profiles/latest', handleGetLatestProfile)

export default router
