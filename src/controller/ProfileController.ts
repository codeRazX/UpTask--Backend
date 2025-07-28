import { RequestHandler } from "express";
import { comparePassword, hashPassword, throwError } from "../helper/helpers";
import User from "../models/User";

export default class ProfileController {

  static updateProfile : RequestHandler = async (req, res, next) => {
    const {name, email} = req.body
    const user = req.user!
    
    if (user.name === name && user.email === email){
      return throwError(next, 'No changes detected', 400)
    }
    
    const existsUserWithThisEmail = await User.findOne({email})
    if (existsUserWithThisEmail && user.id.toString() !== existsUserWithThisEmail?.id.toString()){
      return throwError(next, 'This email is already in use, please enter another one', 409)
    }

    user.name = name
    user.email = email
    await user.save()

    res.status(200).send('Profile updated successfully')
  }

  static updatePassword : RequestHandler = async (req, res, next) => {
    const {password, current_password} = req.body
    const user = await User.findById(req.user?.id)
    if (user && !await comparePassword(current_password, user.password)){
      return throwError(next, 'Invalid current password', 400)
    }
    const hashedPassword = await hashPassword(password)
    await req.user?.updateOne({password: hashedPassword})
    res.status(200).send('Password updated successfully')
  }
}