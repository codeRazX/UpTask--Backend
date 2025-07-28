import {RequestHandler} from 'express'
import { validationResult } from 'express-validator'
import { formatErrors, throwError } from '../helper/helpers'


export const validationRequestBody : RequestHandler = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()){
    throwError(next, 'Validation failed', 400, formatErrors(errors.array()))
  }
  return next()
}



