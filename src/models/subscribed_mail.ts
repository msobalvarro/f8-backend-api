import type { SubscribeMailPropierties } from '@/utils/interfaces'
import { model, Schema } from 'mongoose'

const subscribeMails = new Schema<SubscribeMailPropierties>(
  {
    email: String,
    active: {
      type: Boolean,
      required: false,
      default: true
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export const subscribeMailsModel = model('subscribedMails', subscribeMails)
