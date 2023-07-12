import Joi from 'joi'

export const tahunSemesterValidation: Joi.ObjectSchema = Joi.object({
  tahun: Joi.string(),
  semester: Joi.string()
})
