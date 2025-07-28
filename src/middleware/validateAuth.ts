import { RequestHandler } from 'express'
import Token from '../models/Token'
import { getDiffTimeBetweenDate, throwError } from '../helper/helpers'


export const tokenAuthExists : RequestHandler = async (req, res, next) => {
 
  const {token} = req.body
  const existsToken = await Token.findOne({token, validationPassword: false})
  if (!existsToken){
    return throwError(next, 'The token has expired or is invalid, please request confirmation again', 401)
  }
  
  const hasExpired = getDiffTimeBetweenDate(existsToken.expiresAt)
  if (hasExpired >= 10){
    await existsToken.deleteOne()
    return throwError(next, 'This email confirmation link has expired. Please request a new one', 401)
  }

  req.tokenAuth = existsToken
  return next()
}

export const tokenPasswordExists : RequestHandler = async (req, res, next) => {
 
    const {token} = req.body
    const existsToken = await Token.findOne({token, validationPassword: true})

    if (!existsToken){
      return throwError(next, 'The token has expired or is invalid, please request a password reset again.', 401)
    }

    const hasExpired = getDiffTimeBetweenDate(existsToken.expiresAt)
    if (hasExpired >= 10){
      await existsToken.deleteOne()
      return throwError(next, 'The password reset link has expired, request a new one.', 401)
    }

    req.tokenPassword = existsToken
    return next()
 
}