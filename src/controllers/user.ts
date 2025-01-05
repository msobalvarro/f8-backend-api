import type { UsersPropierties } from '@/utils/interfaces'
import { authMiddleware } from '@/middleware'
import { usersModel } from '@/models/user'
import { createHash } from '@/utils/jwt'
import { createUserValidation } from '@/utils/validations'
import { Router, type Request, type Response } from 'express'

const routerUser = Router()

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
    res.status(500).send(String(error))
  }
})
