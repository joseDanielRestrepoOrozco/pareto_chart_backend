import { Router } from 'express'
import { getAnalysis } from '../controllers/analysis.controller.js'
import authRequired from '../middlewares/authRequired.js'

const router = Router()

router.use(authRequired)

// GET /api/pareto/:projectId
router.get('/:projectId', getAnalysis)

export default router
