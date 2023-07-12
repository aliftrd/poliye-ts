import { Router } from 'express'
import authController from '../controllers/auth.controller'
import scoreController from '../controllers/score.controller'
import authMiddleware from '../middlewares/auth.middleware'

const apiRouter: Router = Router()

// route for public
apiRouter.post('/login', authController.login)

apiRouter.use(authMiddleware)
apiRouter.post('/score', scoreController)

export { apiRouter }
