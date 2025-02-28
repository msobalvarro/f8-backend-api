import dotenv from 'dotenv'
import multer from 'multer'
import path, { resolve } from 'path'
import fs from 'fs'
import { Router, type Request, type Response } from 'express'
import { fileURLToPath } from 'url'
import { PUBLIC_FOLDER } from '@/utils/constants'
import { apiLimiterDefault, authMiddleware } from '@/middleware'
import { responseError } from '@/utils/errors'

dotenv.config()

export const routerImage = Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const uploadDir = path.join(__dirname, PUBLIC_FOLDER)

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage,
  limits: { fieldSize: 2 * 1024 * 1024 }
})

routerImage.post('/', authMiddleware, upload.single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).send('No se ha subido ningún archivo.')
    }

    res.status(200).send({ fileName: req.file?.filename })
  } catch (error) {
    responseError(res, error)
  }
})

routerImage.post('/public', apiLimiterDefault, upload.single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).send('No se ha subido ningún archivo.')
    }

    res.status(200).send({ fileName: req.file?.filename })
  } catch (error) {
    responseError(res, error)
  }
})

routerImage.get('/images/:imageName', async (req: Request, res: Response) => {

  const imagePath = resolve(`${uploadDir}/${req.params.imageName}`)

  try {
    const fs = await import('fs/promises')
    await fs.access(imagePath)
    res.header('Content-Type', 'image/jpeg').sendFile(imagePath)
  } catch (error) {
    responseError(res, error)
  }
})

routerImage.get('/document/:filename', authMiddleware, async (req: Request, res: Response) => {
  const filePath = resolve(`${uploadDir}/${req.params.filename}`)

  try {
    const fs = await import('fs/promises')
    await fs.access(filePath)
    res.header('Content-Type', 'application/pdf').sendFile(filePath)
  } catch (error) {
    responseError(res, error)
  }
})
