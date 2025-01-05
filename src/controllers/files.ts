import { authMiddleware } from '@/middleware'
import { verifyHeaderToken } from '@/utils/validateToken'
import { Router, Request, Response } from 'express'
import { existsSync, mkdirSync } from 'fs'
import { writeFile } from 'fs/promises'
import path from 'path'

export const router = Router()

const uploadDir = <string>process.env.PUBLIC_FOLDER

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {

  } catch (error) {
    res.status(500).send(error)
  }
})
