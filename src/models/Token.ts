import {Schema, Document, model, Types} from 'mongoose'


export type TokenType = Document & {
  token: string,
  user: Types.ObjectId,
  expiresAt: Date,
  validationPassword: boolean
}

export const TokenSchema : Schema = new Schema({
  token: {
    type: String,
    required: true
  },

  user: {
    type: Types.ObjectId,
    ref: 'User'
  },

  expiresAt: {
    type: Date,
    default: Date.now,
    expires: '10m'
  },

  validationPassword: {
    type: Boolean,
    required: false,
    default: false
  }

}, {versionKey: false})

const Token = model<TokenType>('Token', TokenSchema)
export default Token