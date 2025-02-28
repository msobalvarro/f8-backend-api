import type { SubscribeMailPropierties } from '@/utils/interfaces'
import { model, Schema } from 'mongoose'

const subscribeMails = new Schema<SubscribeMailPropierties>(
  {
    email: { type: String, required: true },
    active: {
      required: false,
      default: true
    }
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

export const subscribeMailsModel = model('subscribedMails', subscribeMails)
