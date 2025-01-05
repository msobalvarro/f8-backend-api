import { model, models, Schema } from 'mongoose'
import { PreferencesPropierties } from '@/utils/interfaces'

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

export const preferencesModel  = models?.preferences || model('preferences', preferences)
