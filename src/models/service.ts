import { ServicesPropierties } from '@/utils/interfaces'
import { models, Schema, model } from 'mongoose'

export const services = new Schema<ServicesPropierties>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    archived: { type: Boolean, required: false, default: false },
    images: [String],
    pinned: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export const servicesModel = models?.services || model('services', services)
