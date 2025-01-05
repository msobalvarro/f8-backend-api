import { model, Schema } from 'mongoose'
import type { PreferencesPropierties } from '@/utils/interfaces'

const preferences = new Schema<PreferencesPropierties>(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
)

export const preferencesModel = model('preferences', preferences)
