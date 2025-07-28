import { body } from "express-validator";
import User from "../models/User";


export const validationBodyProject = [
  body('projectName')
    .notEmpty().withMessage('The project name is required').bail()
    .isLength({max: 100}).withMessage('Maximum 100 characters allowed'),

  body('clientName')
    .notEmpty().withMessage("The client's name is required").bail()
    .isLength({max: 100}).withMessage('Maximum 100 characters allowed'),
  
  body('description').notEmpty().withMessage('A description is required')
]

export const validationBodyTask = [
  body('name')
    .notEmpty().withMessage('The task name is required').bail()
    .isLength({max: 100}).withMessage('Maximum 100 characters allowed'),

  body('description').notEmpty().withMessage('A description for the task is required')
]

export const validationStatusTask = [
  body('status')
    .notEmpty().withMessage('Status is required')
]

export const validationNewAccount = [
  body('email')
    .isEmail().toLowerCase().withMessage('Invalid email address').bail()
    .custom(async (value) => {
      const emailExists = await User.findOne({email: value})
      if (emailExists) throw new Error('This email is already in use, please enter another one')
      return true
    }),
  
  body('password')
    .notEmpty().withMessage('Password is required').bail()
    .isLength({min: 8}).withMessage('Password must have a minimum of 8 characters').bail()
    .isLength({max: 64}).withMessage('Password must have a maximum of 64 characters').bail()
    .matches(/[A-Z]/).withMessage('Password must contain at least one capital letter'),

  body('confirm_password')
    .notEmpty().withMessage('You must confirm the password').bail()
    .custom( (value, {req}) => {
      const isSamePassword = value === req.body.password
      if (!isSamePassword){
        throw new Error('Passwords must match')
      }
      return true
    }),

  body('name')
    .notEmpty().withMessage('Name is required').bail()
    .isLength({max: 100}).withMessage('Name must have a maximum of 100 characters')
]

export const validationToken = [
  body('token').notEmpty().withMessage('You must provide a valid token')
]

export const validationLogin = [
  body('email').isEmail().toLowerCase().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required')
]

export const validateAnEmail = [
  body('email').isEmail().toLowerCase().withMessage('Invalid email address'),
]

export const validationNewPassword = [
  
  body('password')
    .notEmpty().withMessage('Password is required').bail()
    .isLength({min: 8}).withMessage('Password must have a minimum of 8 characters').bail()
    .isLength({max: 64}).withMessage('Password must have a maximum of 64 characters').bail()
    .matches(/[A-Z]/).withMessage('Password must contain at least one capital letter'),

  body('confirm_password')
    .notEmpty().withMessage('You must confirm the password').bail()
    .custom( (value, {req}) => {
      const isSamePassword = value === req.body.password
      if (!isSamePassword){
        throw new Error('Passwords must match')
      }
      return true
    })
]

export const validationNote = [
  body('content')
    .notEmpty().withMessage('Content is required').bail()
    .isLength({max: 250}).withMessage('Content must have a maximum of 250 characters')
]

export const validationUpdateProfile = [
  body('name')
    .notEmpty().withMessage('Name is required').bail()
    .isLength({max: 100}).withMessage('Name must have a maximum of 100 characters'),

  body('email').isEmail().toLowerCase().withMessage('Invalid email address'),
]

export const validationNewPasswordProfile = [
  body('current_password')
    .notEmpty().withMessage('Current password is required').bail(),

  body('password')
    .notEmpty().withMessage('Password is required').bail()
    .isLength({min: 8}).withMessage('Password must have a minimum of 8 characters').bail()
    .isLength({max: 64}).withMessage('Password must have a maximum of 64 characters').bail()
    .matches(/[A-Z]/).withMessage('Password must contain at least one capital letter'),

  body('confirm_password')
    .notEmpty().withMessage('You must confirm the password').bail()
    .custom( (value, {req}) => {
      const isSamePassword = value === req.body.password
      if (!isSamePassword){
        throw new Error('Passwords must match')
      }
      return true
    })
]

export const validationCheckPassword = [
  body('password').notEmpty().withMessage('Password is required')
]