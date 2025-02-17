import type { JobsPropierties } from '@/utils/interfaces'
import { model, Schema } from 'mongoose'

export const jobs = new Schema<JobsPropierties>(
  {
    active: { type: Boolean, required: false, default: true },
    description: String,
    image: { required: false, type: String },
    tags: [String],
    title: String
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export const jobsModel = model('jobs', jobs)
