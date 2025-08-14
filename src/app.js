import express from 'express'
import cors from 'cors'
import { connectDB } from './db.js'
import authRoutes from './routes/auth.routes.js'
import projectsRoutes from './routes/projects.routes.js'
import problemsRoutes from './routes/problems.routes.js'
import paretoRoutes from './routes/pareto.routes.js'

import tokenExtractor from './middlewares/tokenExtractor.js'
import unknownEndpoint from './middlewares/unknownEndpoint.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()

connectDB()

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)

app.use('/api/auth', authRoutes)
// Mount routers under their corresponding /api/* bases
app.use('/api/projects', projectsRoutes)
app.use('/api/problems', problemsRoutes)
app.use('/api/pareto', paretoRoutes)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app
