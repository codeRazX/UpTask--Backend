import {Schema, Document, model, Types, PopulatedDoc} from 'mongoose'
import type { TaskType } from './Task'
import type { UserType } from './User'
import Task from './Task'
import Note from './Note'

export type ProjectType = Document & {
  projectName: string,
  clientName: string,
  description: string,
  tasks: PopulatedDoc<TaskType & Document>[],
  manager: PopulatedDoc<UserType & Document>,
  team: PopulatedDoc<UserType & Document>[],
}


const ProjectSchema: Schema = new Schema({
  projectName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },

  clientName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  tasks: [
    {
      type: Types.ObjectId,
      ref: 'Task'
    }
  ],

  manager : {
    type: Types.ObjectId,
    ref: 'User'
  },

  team: [
    {
      type: Types.ObjectId,
      ref: 'User'
    }
  ],

  
}, {versionKey: false, timestamps: true})

ProjectSchema.pre('deleteOne', {document: true}, async function(){
  const projectId = this._id
  if (!projectId) return;

  const tasks = await Task.find({project: projectId})
  for (const task of tasks){
    await Note.deleteMany({task: task.id})
  }
  await Task.deleteMany({project: projectId})
})

const Project= model<ProjectType>('Project', ProjectSchema)
export default Project
