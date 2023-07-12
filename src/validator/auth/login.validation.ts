import Joi from 'joi'

export const loginValidation: Joi.ObjectSchema = Joi.object({
  nim: Joi.string().required(),
  password: Joi.string().required()
}).messages({
  'any.required': '{#label} wajib diisi'
})
