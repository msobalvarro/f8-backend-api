import { authentication } from '@/services/authentication'
import { Router } from 'express'
import type { Request, Response } from 'express'
import type { LoginProps } from '@/utils/interfaces'

export const routerLogin = Router()

// Endpoint para manejar el login
routerLogin.post('/', async (req: Request, res: Response) => {
  try {
    const params: LoginProps = req.body
    const userAuth = await authentication(params.username, params.password)
    res.send(userAuth)
  } catch (error) {
    console.log(error)
    res.status(500).send(String(error))
  }
})
