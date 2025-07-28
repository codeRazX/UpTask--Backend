import 'dotenv/config'
import { Response } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import { UserType } from '../models/User'
import { getDiffTimeBetweenDate } from './helpers'


export const generateJWTAndSendCookie = (res: Response, userId : UserType['id']) => {
  const token = jsonwebtoken.sign({userId}, String(process.env.JWT_SECRET), {
    expiresIn: '1d'
  })

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production'? 'none' : 'lax',
    maxAge: 3600 * 24 * 1000
  })
}

export const shouldRefreshToken = (exp : jsonwebtoken.JwtPayload['exp'])  => {
  if (exp){
    return -getDiffTimeBetweenDate(new Date(exp * 1000)) < Number(process.env.TM_MAX_REFRESH)
  }
}