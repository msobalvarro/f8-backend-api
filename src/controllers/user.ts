import type { UsersPropierties } from '@/utils/interfaces'
import { authMiddleware } from '@/middleware'
import { usersModel } from '@/models/user'
import { createHash } from '@/utils/jwt'
import { createUserValidation, updateUserPassword } from '@/utils/validations'
import { Router, type Request, type Response } from 'express'
import { Types } from 'mongoose'
import { responseError } from '@/utils/errors'

export const routerUser = Router()

routerUser.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const users = await usersModel.find()
    res.status(200).send(users)
  } catch (error) {
    responseError(res, error)
  }
})


routerUser.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const params: UsersPropierties = req.body
    const { name, username, password: pwd } = createUserValidation.parse(params)

    const password = await createHash(pwd)
    const newUser = await usersModel.create({
      name,
      username,
      password,
    })
    res.status(200).send(newUser)
  } catch (error) {
    responseError(res, error)
  }
})

routerUser.put('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const props = updateUserPassword.parse(req.body)
    const password = await createHash(props.password)
    const updatedUser = await usersModel.findByIdAndUpdate(req.user?._id, { password })
    res.send(updatedUser)
  } catch (error) {
    responseError(res, error)
  }
})

routerUser.delete('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.query
    if (!id || !Types.ObjectId.isValid(String(id))) throw new Error('id is not a valid')

    if (req.user?._id === id) {
      throw new Error(`Can not delete this user`)
    }

    const userDeleted = await usersModel.deleteOne({ _id: id })
    res.send(userDeleted)
  } catch (error) {
    responseError(res, error)
  }
})
