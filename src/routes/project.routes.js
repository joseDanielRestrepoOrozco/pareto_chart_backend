import { Router } from 'express'
import {
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  createProblem,
  deleteProblem,
  updateProblem,
  getProjectsByUser,
  getParetoAnalysis,
  getParetoChartData
} from '../controllers/project.controller.js'
import authRequired from '../middlewares/authRequired.js'
import validateSchema from '../middlewares/validator.middleware.js'
import { problemSchema } from '../schemas/problem.schema.js'
import { projectSchema } from '../schemas/project.schema.js'

const router = Router()

router.use(authRequired)

router.get('/', getProjectsByUser)
router.post('/', validateSchema(projectSchema), createProject)

router.get('/:id', getProjectById)
router.put('/:id', validateSchema(projectSchema), updateProject)
router.delete('/:id', deleteProject)

router.post('/:id/problems', validateSchema(problemSchema), createProblem)
router.delete('/:id/problems/:problemId', deleteProblem)
router.put('/:id/problems/:problemId', validateSchema(problemSchema), updateProblem)

router.get('/:id/pareto', getParetoAnalysis)
router.get('/:id/pareto/chart', getParetoChartData)

export default router
