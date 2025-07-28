import {ErrorRequestHandler} from 'express'
import mongoose from 'mongoose'

export const handlerError : ErrorRequestHandler = (error, req, res, next) => {
  let message = error.message || 'An unexpected error occurred'
  let status = error.status || 500
  const details = error.details || null
 
  if (error instanceof mongoose.Error.CastError) {
    message = 'An unexpected error occurred. The requested element is invalid or does not exist'
    status = 404
  } else if (error instanceof mongoose.Error.ValidationError) {
    message = 'Validation failed'
    status = 400
  } else if (error instanceof mongoose.Error) {
    message = 'An unexpected error occurred'
    status = 500
  }
  else if (error instanceof TypeError){
    message = 'An unexpected error occurred'
    status = 500
  }
 
  
  if (!res.headersSent){
    return res.status(status).json({message, details})
  }
}