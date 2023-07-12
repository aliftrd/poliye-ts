import express from 'express'
import { apiRouter } from '../routes/api.routes'
import { morganMiddleware } from '../middlewares/morgan.middleware'
import { errorMiddleware } from '../middlewares/error.middleware'

export const web = express()
web.use(express.json())
web.use(express.urlencoded({ extended: true }))

// Define your route here
web.use('/api', apiRouter)

// Define your middleware here
web.use(morganMiddleware)
web.use(errorMiddleware)
