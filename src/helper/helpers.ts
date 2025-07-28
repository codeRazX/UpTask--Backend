import 'dotenv/config'
import { NextFunction } from "express";
import type { UserType } from "../models/User";
import Token from '../models/Token';
import AuthEmail from '../emails/AuthEmails';
import bcrypt from 'bcrypt'

type ErrorFromValidator = { path: string; msg: string };
type CustomErrorType = Error & {
  message: string,
  status: number,
  details?: Record<string, string>| null
}

export const throwError = (next : NextFunction, message: CustomErrorType['message'], status: CustomErrorType['status'], details: CustomErrorType['details'] = null) => {
  const error = new Error(message) as CustomErrorType
  error.status = status
  error.message = message
  error.details = details
  next(error)
}

export const formatErrors = (errors: unknown): Record<string, string > => {
  if (!Array.isArray(errors)) return {};
  return Object.fromEntries(
    (errors as ErrorFromValidator[]).map(e => [e.path, e.msg])
  );
};


export const hashPassword = async (password: UserType['password'])  => bcrypt.hash(password, Number(process.env.SALT))

export const comparePassword = async (rawPassword: UserType['password'], storedPassword: UserType['password']) => bcrypt.compare(rawPassword, storedPassword)

export const generate6DigitToken = () : string  => String(Math.floor(100000 + Math.random() * 900000))

export const getDiffTimeBetweenDate = (dateToCompare: Date) => {
  const now = new Date();
  return Math.floor((now.getTime() - dateToCompare.getTime()) / 60000);
}

export const createAndSendToken = async (user: UserType) => {
  const token = new Token()
  token.user = user.id
  token.token = generate6DigitToken()
  await token.save()

  if (process.env.NODE_ENV !== 'dev') {
    AuthEmail.sendConfirmationEmail({
      email: user.email,
      name: user.name,
      token: token.token
    })
  }

  return token
}

export const createAndSendTokenResetPassword = async (user: UserType) => {
  const token = new Token()
  token.user = user.id
  token.token = generate6DigitToken()
  token.validationPassword = true
  await token.save()

  if (process.env.NODE_ENV !== 'dev') {
    AuthEmail.sendResetPassword({
      email: user.email,
      name: user.name,
      token: token.token
    })
  }

  return token
}