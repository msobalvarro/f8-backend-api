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

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Límite de 100 peticiones por IP en el tiempo definido
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.',
  standardHeaders: true, // Enviar información de límite en los encabezados `RateLimit-*`
  legacyHeaders: false, // Desactivar los encabezados `X-RateLimit-*`
})
