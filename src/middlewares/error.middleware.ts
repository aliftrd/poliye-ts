import Exception from '../exceptions/Exception'
import HttpStatusCode from '../enums/HttpStatusCode'
import { type NextFunction, type Request, type Response } from 'express'
import * as process from 'process'
import { resolveErrorResponse } from '../helpers/response.helper'

export const errorMiddleware = (error: Error, request: Request, response: Response, next: NextFunction): Response => {
  if (error !== undefined) {
    next()
  }

  if (error instanceof Exception) {
    return resolveErrorResponse(response, {
      code: error.code,
      message: error.message
    })
  }

  return resolveErrorResponse(response, {
    code: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
  })
}
