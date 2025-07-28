import { RequestHandler } from 'express'
import Project from '../models/Project'
import { throwError } from '../helper/helpers'


export const projectExists : RequestHandler = async (req, res, next) => {
 
  const {projectId} = req.params
  const project = await Project.findById(projectId)

  if (!project) {    
    return throwError(next, 'An unexpected error occurred. The requested element is invalid or does not exist', 404)
  }
  
  req.project = project
  return next()
}