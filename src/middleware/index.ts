import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '@/utils/jwt'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization']
    if (!token) {
      throw new Error('Token git branch -M mainis required')
    }

    const bearer = token.split(' ')[1]
    const data = verifyToken(bearer)
    req.cookies = data
    next()
  } catch (error) {
    res.status(401).send(`${error}`)
  }
}