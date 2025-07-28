import { RequestHandler } from "express";
import User from "../models/User";
import { throwError } from "../helper/helpers";
import Project from "../models/Project";


export default class TeamController {

  static findMemberById : RequestHandler = async (req, res, next) => {
    const {email} = req.body
    const user = await User.findOne({email}).select('id email name')

   
    if (!user) {
      return throwError(next, 'User not found', 404)
    }
    if (user.id.toString() === req.user?.id.toString()){
      return throwError(next, 'You are already the project manager', 401)
    }

    res.status(200).json(user)
  }

  static addMemberById : RequestHandler = async (req, res, next) => {
    const {memberId} = req.body
    const user = await User.findById(memberId).select('id email name')
    
    if (!user) {
      return throwError(next, 'User not found', 404)
    }
    
    const project = req.project!
    
    if (project.team.some(member => member?.toString() === user.id.toString())){
      return throwError(next, 'The collaborator already exists in the project', 409)
    }
    
    project.team.push(user.id)
    await project.save()
    res.status(200).send('Collaborator successfully added')

  }

  static removeMemberById : RequestHandler = async (req, res, next) => {
    const {memberId} = req.params

    const project = req.project!

    if (!project.team.some(member => member?.toString() === memberId)){
      return throwError(next, 'The collaborator does not exist in the project', 409)
    }

    project.team = project.team.filter(member => member?.toString() !== memberId)
    await project.save()
    res.status(200).send('Collaborator successfully deleted')
  }

  static getProjecTeam : RequestHandler = async (req, res, next) => {
    const team = await Project.findById(req.project?.id).populate('team', 'id email name')
    res.status(200).json(team?.team)
  }
}