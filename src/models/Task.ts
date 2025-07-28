import { Schema, model, Document, Types, PopulatedDoc } from "mongoose";
import { NoteType } from "./Note";

const taskStatus = {
  PENDING: 'pending',
  ON_HOLD: 'onHold',
  IN_PROGRESS: 'inProgress',
  UNDER_REVIEWS: 'underReview',
  COMPLETED: 'completed'
} as const

export type TaskStatusType = typeof taskStatus[keyof typeof taskStatus]

export type TaskType = Document & {
  name: string,
  description: string,
  project: Types.ObjectId,
  status: TaskStatusType,
  whoWorking: {
    user: Types.ObjectId,
    status: TaskStatusType
  }[],
  notes: PopulatedDoc<NoteType & Document>[],
}

const TaskSchema : Schema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 100
  },

  description: {
    type: String,
    trim: true,
    required: true
  },

  project: {
    type: Types.ObjectId,
    ref: 'Project'
  }, 

  status: {
    type: String,
    enum: Object.values(taskStatus),
    default: taskStatus.PENDING
  },

  whoWorking: [
    {
      user : {
        type: Types.ObjectId,
        ref: 'User',
        default: null
      },
      status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
      }
    }
  ],

  notes: [
    {
      type: Types.ObjectId,
      ref: 'Note'
    }
  ]

}, {versionKey: false, timestamps: true})

const Task = model<TaskType>('Task', TaskSchema);
export default Task  