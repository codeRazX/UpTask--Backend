import 'dotenv/config'
import { RequestHandler } from "express";
import User from "../models/User";
import Token from '../models/Token'
import {throwError, hashPassword, comparePassword, getDiffTimeBetweenDate, createAndSendToken, createAndSendTokenResetPassword } from '../helper/helpers';
import { generateJWTAndSendCookie } from '../helper/jwt';



export default class AuthController {
  
  static createAccount : RequestHandler = async (req, res, next) => {
    const {confirm_password,  ...data} = req.body

    const user = new User(data)
    user.password = await hashPassword(data.password)
    await Promise.allSettled([user.save(), createAndSendToken(user)])
    
    const response = process.env.NODE_ENV === 'test' ? user : 'Account registered successfully, check your email to confirm it';
    res.status(201).send(response);
  }

  static confirmAccount: RequestHandler = async (req, res, next) => {
    const token = req.tokenAuth
    const user = await User.findById(token?.user)
    if (!user || !token) {
      return throwError(next,'Authentication could not be completed, please try again', 404)
    }
    user.confirmed = true
    await Promise.allSettled([user.save(), token.deleteOne()])
    res.status(200).send('Account confirmed successfully');
  }


  static login : RequestHandler = async (req, res, next) =>{
    const {email, password} = req.body
    const user = await User.findOne({email})
    
    if (!user || !await comparePassword(password, user.password)){
      return throwError(next, 'Invalid email or password', 404)
    }

    if (!user.confirmed){
      const hasAnyToken = await Token.findOne({user, validationPassword: false})

      if (hasAnyToken){
        const hasExpired = getDiffTimeBetweenDate(hasAnyToken.expiresAt)

        if (hasExpired <= 5){
          return throwError(next, 'Please check your email to confirm the account', 401)
        }

        await Promise.allSettled([hasAnyToken.deleteOne(), createAndSendToken(user)])
        return throwError(next, 'Your account is not confirmed. Please check your email to activate it', 401)
      }
      
      await createAndSendToken(user)
      return throwError(next, 'Your account is not confirmed. Please check your email to activate it', 401)
    }

   
    generateJWTAndSendCookie(res, user.id)   
    res.status(200).send('Login')
  }

  static requestNewToken : RequestHandler = async (req, res, next) => {
    const {email} = req.body
    const user = await User.findOne({email})

    if (!user){
      return throwError(next, 'The confirmation email could not be sent, user not found', 404)
    }

    if (!user.confirmed){
      const hasAnyToken = await Token.findOne({user, validationPassword: false})

      if (hasAnyToken){
        const hasExpired = getDiffTimeBetweenDate(hasAnyToken.expiresAt)

        if (hasExpired <= 5){
          return throwError(next, 'We have already sent a confirmation link to your email, please check it', 401)
        }

        await Promise.allSettled([hasAnyToken.deleteOne(), createAndSendToken(user)])
        return res.status(200).send('A link has been sent to you to confirm your account, check your email')
      }
      
      await createAndSendToken(user)
      return res.status(200).send('A link has been sent to you to confirm your account, check your email')
    }

    res.status(200).send('Your account has been confirmed, please log in')
  }


  static forgotPassword : RequestHandler = async (req, res, next) => {
    const {email} = req.body
    const user = await User.findOne({email})

    if (!user) {
      return throwError(next, 'The action could not be completed, user not found', 404)
    }
    
    const hasAnyToken = await Token.findOne({user: user.id, validationPassword: true})

    if (hasAnyToken){
      const hasExpired = getDiffTimeBetweenDate(hasAnyToken.expiresAt)

      if (hasExpired <= 5){
        return throwError(next, 'Please check your email and follow the instructions to reset your password', 401)
      }


      await Promise.allSettled([hasAnyToken.deleteOne(), createAndSendTokenResetPassword(user)])
      return res.status(200).send('An email has been sent to reset your password, please follow the instructions')
    }

    await createAndSendTokenResetPassword(user)
    return res.status(200).send('An email has been sent to reset your password, please follow the instructions')

  }

  static validateTokenResetPassword: RequestHandler = async (req, res, next) => {
    const {token} = req.body
    const existsToken = await Token.findOne({token, validationPassword: true})

    if (!existsToken){
      return throwError(next, 'The token has expired or is invalid, please request a password reset again.', 401)
    }

    const user = await User.findOne({_id: token.user})
    if (!user){
      return throwError(next, 'The action could not be completed, user not found', 404)
    }
    
    const hasExpired = getDiffTimeBetweenDate(existsToken.expiresAt)
    if (hasExpired >= 10){
      await existsToken.deleteOne()
      return throwError(next, 'The password reset link has expired, request a new one.', 401)
    }

    await existsToken.deleteOne()
    res.status(200).send('Validation to reset password successfully')
 
  }

  static resetNewPassword : RequestHandler = async (req, res, next) => {
    const token = req.tokenPassword!
    const {password} = req.body
    const user = await User.findOne({_id: token.user})
  
    if (!user){
      return throwError(next, 'The action could not be completed, user not found', 404)
    }

    user.password = await hashPassword(password)
    await Promise.allSettled([token.deleteOne(), user.save()])
    res.status(200).send('New password set successfully')
  }

  static user : RequestHandler = async (req, res, next) => {
    return res.json(req.user)
  }
  
  static logout : RequestHandler = async(req, res, next) => {

    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production'? 'none' : 'lax',
      maxAge: 3600 * 24 * 1000
    })

    res.status(200).send('Logging out')

  }

  static checkPasword: RequestHandler = async (req, res, next) => {
    const {password} = req.body
    const user = await User.findById(req.user?.id)
    if (user && !await comparePassword(password, user.password)){
      return throwError(next, 'Invalid current password', 400)
    }

    res.status(200).send('Validated password')
    
  }


}