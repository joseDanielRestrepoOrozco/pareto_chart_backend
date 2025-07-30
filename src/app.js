import express from 'express'
import cors from 'cors'
import { connectDB } from './db.js'
import authRoutes from './routes/auth.routes.js'

import tokenExtractor from './middlewares/tokenExtractor.js'
import unknownEndpoint from './middlewares/unknownEndpoint.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()

connectDB()

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)

app.use('/api/auth', authRoutes)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app
