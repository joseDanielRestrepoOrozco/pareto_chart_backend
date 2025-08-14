import { Router } from 'express'
import {
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByUser
} from '../controllers/projects.controller.js'
import authRequired from '../middlewares/authRequired.js'
import validateSchema from '../middlewares/validator.middleware.js'
import { projectSchema } from '../schemas/project.schema.js'

const router = Router()

router.use(authRequired)

router.get('/', getProjectsByUser)
router.post('/', validateSchema(projectSchema), createProject)

router.get('/:id', getProjectById)
router.put('/:id', validateSchema(projectSchema), updateProject)
router.delete('/:id', deleteProject)

export default router
