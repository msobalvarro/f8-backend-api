import type { NextFunction, Request, Response } from 'express'
import { jwtVerify, SignJWT } from 'jose'
import { verifyToken } from './jwt'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization']
    if (!token) {
      throw new Error('Token is required')
    }

    const bearer = token.split(' ')[1]
    const data = verifyToken(bearer)
    req.cookies = data
    next()
  } catch (error) {
    res.status(401).send(`${error}`)
  }
}