import { Router } from 'express'
import { createProblem, deleteProblem, updateProblem } from '../controllers/problems.controller.js'
import authRequired from '../middlewares/authRequired.js'
import validateSchema from '../middlewares/validator.middleware.js'
import { problemSchema } from '../schemas/problem.schema.js'

const router = Router()

router.use(authRequired)

// Manage problems within a specific project
// POST   /api/problems/:projectId
router.post('/:projectId', validateSchema(problemSchema), createProblem)
// DELETE /api/problems/:projectId/:problemId
router.delete('/:projectId/:problemId', deleteProblem)
// PUT    /api/problems/:projectId/:problemId
router.put('/:projectId/:problemId', validateSchema(problemSchema), updateProblem)

export default router
