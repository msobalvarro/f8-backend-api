import type { JobApplicationPropierties } from '@/utils/interfaces'
import { model, Schema, Types } from 'mongoose'

const jobApplications = new Schema<JobApplicationPropierties>(
  {
    cv: { type: String, required: true },
    email: String,
    fullName: String,
    phoneNumber: String,
    job: { type: Types.ObjectId, ref: 'jobs' },
  },
  {
    timestamps: true,
    versionKey: false
  },
)

export const jobApplicationModel = model('jobApplications', jobApplications)
