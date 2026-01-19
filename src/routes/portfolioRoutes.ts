import { Router } from 'express'
import { upload } from '../config/multer'
import * as ctrl from '../controllers/portfolioController'
import { authenticate } from '../middlewares/authMiddleware'

const router = Router()
const uploadFields = upload.fields([
  { name: 'imageBanner', maxCount: 1 },
  { name: 'allImage', maxCount: 10 },
  { name: 'logo', maxCount: 5 },
])

router.post('/portfolios', authenticate, uploadFields, ctrl.addPortfolio)
router.put('/portfolios/:id', authenticate, uploadFields, ctrl.updatePortfolio)
router.get('/portfolios/:id', ctrl.getById)
router.get('/portfolios', ctrl.fetchAll)
router.delete('/portfolios/:id', authenticate, ctrl.remove)

export default router
