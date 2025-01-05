import type { MessagesPropierties } from '@/utils/interfaces'
import { model, Schema } from 'mongoose'

const message = new Schema<MessagesPropierties>(
  {
    archived: { type: Boolean, required: false, default: false },
    fullName: { type: String, required: true },
    company: { type: String, required: false },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export const messageModel = model('messages', message)
