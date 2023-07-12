import { type Response } from 'express'
import HttpStatusCode from '../enums/HttpStatusCode'
import type { ErrorResponse, SuccessResponse } from '../types/types'

export const resolveSuccessResponse = (response: Response, payload: SuccessResponse): Response => {
  payload.code = (payload.code as unknown as number) ?? HttpStatusCode.OK
  return response.status(payload.code).json({
    code: payload.code,
    message: payload.message,
    data: payload.data
  })
}

export const resolveErrorResponse = (response: Response, payload: ErrorResponse): Response => {
  payload.code = (payload.code as unknown as number) ?? HttpStatusCode.BAD_REQUEST
  return response.status(payload.code).json({
    code: payload.code,
    message: payload.message,
    error: payload.error
  })
}
