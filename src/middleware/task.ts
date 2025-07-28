import { RequestHandler } from 'express'
import Task from '../models/Task'
import { throwError } from '../helper/helpers'


export const taskExists : RequestHandler = async (req, res, next) => {
 
  const {taskId} = req.params
  const task = await Task.findById(taskId)

  if (!task) {    
    return throwError(next, 'An unexpected error occurred. The requested element is invalid or does not exist', 404)
  }

  if (task.project.toString() !== req.project?.id.toString()){
    return throwError(next, 'You cannot perform this action', 401)
  }

  req.task = task
  return next()
}

