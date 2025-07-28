import {Schema, Types, model, Document} from 'mongoose'

export type NoteType = Document & {
  content: string,
  createdBy: Types.ObjectId,
  task: Types.ObjectId
}

const NoteSchema : Schema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 250,
  },

  createdBy: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },

  task: {
    type: Types.ObjectId,
    ref: 'Task',
    required: true,
  }
}, {timestamps: true, versionKey: false}) 

const Note = model<NoteType>('Note', NoteSchema)
export default Note;