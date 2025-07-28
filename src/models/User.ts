import {Schema, Document, model} from 'mongoose'

export type UserType = Document & {
  email: string,
  password: string,
  name: string,
  confirmed: boolean
}

const userSchema : Schema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 64
  },

  name: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true,
  },

  confirmed: {
    type: Boolean,
    default: false
  }
}, {versionKey: false})

const User = model<UserType>('User', userSchema)
export default User