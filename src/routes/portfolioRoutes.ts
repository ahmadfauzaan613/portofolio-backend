import { Router } from 'express'
import { upload } from '../config/multer'
import * as ctrl from '../controllers/portfolioController'

const router = Router()
const uploadFields = upload.fields([
  { name: 'imageBanner', maxCount: 1 },
  { name: 'allImage', maxCount: 10 },
  { name: 'logo', maxCount: 5 },
])

router.post('/portfolios', uploadFields, ctrl.addPortfolio)
router.put('/portfolios/:id', uploadFields, ctrl.updatePortfolio)
router.post('/portfolios/list', ctrl.fetchAll)
router.delete('/portfolios/:id', ctrl.remove)

export default router
