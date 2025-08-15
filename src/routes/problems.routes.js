import { Router } from 'express'
import { createProblem, deleteProblem, updateProblem } from '../controllers/problems.controller.js'
import authRequired from '../middlewares/authRequired.js'
import validateSchema from '../middlewares/validator.middleware.js'
import { problemSchema } from '../schemas/problem.schema.js'

const router = Router()

router.use(authRequired)

router.post('/:projectId', validateSchema(problemSchema), createProblem)

router.delete('/:problemId', deleteProblem)

router.put('/:problemId', validateSchema(problemSchema), updateProblem)

export default router
