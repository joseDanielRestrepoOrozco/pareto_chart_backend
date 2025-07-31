import { Router } from 'express'
import {
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  createProblem,
  deleteProblem,
  updateProblem,
  getProjectsByUser
} from '../controllers/project.controller.js'
import authRequired from '../middlewares/authRequired.js'
import validateSchema from '../middlewares/validator.middleware.js'
import { problemSchema } from '../schemas/problem.schema.js'

const router = Router()

router.use(authRequired)

router.get('/', getProjectsByUser)
router.post('/', createProject)

router.get('/:id', getProjectById)
router.put('/:id', updateProject)
router.delete('/:id', deleteProject)

router.post('/:id/problems', validateSchema(problemSchema), createProblem)
router.delete('/:id/problems/:problemId', validateSchema(problemSchema), deleteProblem)
router.put('/:id/problems/:problemId', updateProblem)

export default router
