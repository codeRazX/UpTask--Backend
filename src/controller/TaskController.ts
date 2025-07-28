import type { RequestHandler } from "express"
import Task from "../models/Task"
import 'dotenv/config'
import Note from "../models/Note"



export default class TaskController {

  static getAllTaskFromProject : RequestHandler = async (req, res, next) => {
    const tasks = await Task.find({project: req.project?.id}).populate('project')
    res.status(200).json(tasks)
  }
  
  static getTaskById : RequestHandler = async (req, res, next) => {
    const task = await Task.findById(req.task?.id)
    .populate('whoWorking.user', '_id name email')
    .populate({
      path: 'notes',
      select: '_id createdAt content createdBy',
      populate: {
        path: 'createdBy',
        select: '_id name email'
      }
    })

    res.status(200).json(task)
  }

  static createTask : RequestHandler = async (req, res, next) => {
    const task = new Task(req.body)
    const project = req.project
    task.project = project?.id
    project?.tasks.push(task.id)
    await Promise.allSettled( [task.save(), project?.save()])
    res.status(201).send('Task created successfully');
  }

  static updateTask : RequestHandler = async (req, res, next) => {
    await Task.findOneAndUpdate(
      {_id: req.task?.id},
      req.body, 
      {new: true}
    )
    res.status(200).send('Task updated successfully');
  }

  static updateStatus: RequestHandler = async (req, res, next) => {
    const {status} = req.body
    const task = req.task!
    const user = req.user!

    task.status = status
    const data = {user: user.id, status}
    
    task.whoWorking.push(data)

    await task.save()
    res.status(200).send('Task status updated successfully');
  }

  static deleteTask : RequestHandler = async (req, res, next) => {
    const project = req.project!
    const task = req.task!
    
    project.tasks = project.tasks.filter(t => t?.toString() !== task.id.toString())
    await Promise.allSettled([project.save(), Note.deleteMany({task: task.id}) ,task.deleteOne()])
    res.status(200).send('Task deleted successfully')
  }



}