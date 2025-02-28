import type { NextFunction, Request, Response } from 'express'
import { rateLimit } from 'express-rate-limit'
import { verifyToken } from '@/utils/jwt'
import type { JwtPayload } from 'jsonwebtoken'

declare module 'express-serve-static-core' {
  interface Request extends JwtPayload {
    _id: string
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization']
    if (!token) {
      throw new Error('token required')
    }

    const bearer = token.split(' ')[1]
    const data = verifyToken(bearer)
    req.user = data
    next()
  } catch (error) {
    res.status(401).send(`${error}`)
  }
}

export const apiLimiterDefault = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
})

export const apiLimiter = (max: number) => rateLimit({
  windowMs: 15 * 60 * 1000,
  max,
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
})