import { Router } from 'express'
import {
  handleCreateProfile,
  handleDeleteProfile,
  handleGetLatestProfile,
  handleUpdateProfile,
  handleUploadResume,
} from '../controllers/profileController'
import { authenticate } from '../middlewares/authMiddleware'
import { uploadPdf } from '../config/multer'

const router = Router()

router.post('/profiles', authenticate, handleCreateProfile)
router.post('/profiles/resume', authenticate, uploadPdf.single('resume'), handleUploadResume)

router.put('/profiles/:id', authenticate, handleUpdateProfile)

router.delete('/profiles/:id', authenticate, handleDeleteProfile)

router.get('/profiles/latest', handleGetLatestProfile)

export default router
