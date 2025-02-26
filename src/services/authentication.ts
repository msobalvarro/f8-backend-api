import { usersModel } from '@/models/user'
import { createHash, generateToken } from '@/utils/jwt'

export const authentication = async (username: string, password: string): Promise<{ token: string }> => {
  const user = await usersModel.findOne({ username, password: await createHash(password) })

  if (!user) throw new Error('user not found')

  return {
    token: await generateToken({ _id: String(user._id) })
  }
}