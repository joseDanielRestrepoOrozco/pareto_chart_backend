import { Router } from 'express'
import { getPareto } from '../controllers/pareto.controller.js'
import authRequired from '../middlewares/authRequired.js'

const router = Router()

router.use(authRequired)

// GET /api/pareto/:projectId
router.get('/:projectId', getPareto)

export default router
