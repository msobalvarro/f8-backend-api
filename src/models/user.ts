import { UsersPropierties } from '@/utils/interfaces';
import { model, models, Schema } from 'mongoose';

const user = new Schema<UsersPropierties>(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const usersModel =  models?.user|| model('user', user)

