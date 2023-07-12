import { type Request } from 'express'
import type Joi from 'joi'
import Exception from '../exceptions/Exception'
import HttpStatusCode from '../enums/HttpStatusCode'

export const validate = (schema: Joi.Schema, request: Request): any => {
  const result: Joi.ValidationResult = schema.validate(request, {
    abortEarly: false
  })
  if (result.error !== undefined) {
    throw new Exception(result.error.message, HttpStatusCode.BAD_REQUEST)
  }

  return result.value
}
