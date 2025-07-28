import express from 'express'
import './config/connectionDB'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { corsConfig } from './config/cors'
import { handlerError } from './middleware/error'
import projectRouter from './routes/projectRoutes'
import authRouter from './routes/authRoutes'
import { pathNotFound } from './middleware/pathNotFound'


export const app = express()
app.use(cors({...corsConfig, credentials: true}))
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())


//Routes
app.use('/api/auth', authRouter)
app.use('/api/projects', projectRouter)


//Middle Error && Route not found
app.use(pathNotFound)
app.use(handlerError)
