import { type NextFunction, type Request, type Response } from 'express'
import HttpStatusCode from '../enums/HttpStatusCode'
import { resolveErrorResponse } from '../helpers/response.helper'

export default async function authMiddleware (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | undefined> {
  const token: string | undefined = request.headers.authorization

  if (token === undefined) {
    return resolveErrorResponse(response, {
      code: HttpStatusCode.UNAUTHORIZED,
      message: 'Unauthorized'
    })
  }

  // if (result === null) {
  //   return resolveErrorResponse(response, {
  //     code: HttpStatusCode.UNAUTHORIZED,
  //     message: 'Unauthorized'
  //   })
  // }
  //
  // request.accessTokenData = result
  next()
}
