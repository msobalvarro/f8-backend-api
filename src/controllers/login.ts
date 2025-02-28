import { authentication } from '@/services/authentication'
import { Router } from 'express'
import type { Request, Response } from 'express'
import type { LoginProps } from '@/utils/interfaces'
import { responseError } from '@/utils/errors'

export const routerLogin = Router()

// Endpoint para manejar el login
routerLogin.post('/', async (req: Request, res: Response) => {
  try {
    const params: LoginProps = req.body
    const userAuth = await authentication(params.username, params.password)
    res.send(userAuth)
  } catch (error) {
    responseError(res, error)
  }
})
