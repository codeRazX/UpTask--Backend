import type { RequestHandler } from "express"
import Project from "../models/Project"
import 'dotenv/config'

export default class ProjectController {

  static getAllProjects : RequestHandler = async (req, res, next)  => {
    const userId = req.user?._id
    const projects =  await Project.find({
      $or: [
        { manager: userId },                 
        { team: { $in: [userId] } },         
      ],
    });
    res.status(200).json(projects)
  }

  static getProjectById: RequestHandler = async (req, res, next) => {
    const project = await req.project?.populate('tasks')
    res.status(200).json(project)
  }

  static createProject : RequestHandler = async (req, res, next) => {
    await Project.create({
      ...req.body,
      manager: req.user?.id
    })
   
    res.status(201).send('Project created successfully');
  }

  static updateProject : RequestHandler = async (req, res, next) => {
    await Project.findOneAndUpdate(
      {_id: req.project?.id},
      req.body,
      {new:true}
    )
    res.status(200).send('Project updated successfully');
  }

  static deleteProject : RequestHandler = async (req, res, next) => {
    const project = req.project!
    await project.deleteOne()
    res.status(200).send('Project deleted successfully')
  }

}