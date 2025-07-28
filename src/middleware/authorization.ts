import { RequestHandler } from "express";
import { throwError } from "../helper/helpers";

export const authorized : RequestHandler = (req, res, next) => {
  const project = req.project!
  const user = req.user!
  
  if (project.manager?.toString() !== user.id.toString() && !project.team?.includes(user.id.toString())){
    return throwError(next, 'You cannot perform this action', 401)
  }
 
  return next()
}

export const unauthorized : RequestHandler = (req, res, next) => {
  const project = req.project!
  const user = req.user!

  if (project.manager?.toString() !== user.id.toString()){
    return throwError(next, 'You cannot perform this action', 401)
  }

  return next()
}