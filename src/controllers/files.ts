import dotenv from 'dotenv'
import multer from 'multer'
import path, { resolve } from 'path'
import fs from 'fs'
import { Router, type Request, type Response } from 'express'
import { fileURLToPath } from 'url'
import { PUBLIC_FOLDER } from '@/utils/constants'
import { authMiddleware } from '@/middleware'

dotenv.config()

export const routerFile = Router()
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

routerFile.post('/', authMiddleware, upload.single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).send('No se ha subido ningún archivo.')
    }

    res.status(200).send({ fileName: req.file?.filename })
  } catch (error) {
    res.status(500).send(String(error))
  }
})

routerFile.get('/:imageName', async (req: Request, res: Response) => {

  const imagePath = resolve(`${uploadDir}/${req.params.imageName}`)

  try {
    const fs = await import('fs/promises')
    await fs.access(imagePath)
    res.header('Content-Type', 'image/jpeg').sendFile(imagePath)
  } catch (error) {
    res.status(500).send(String(error))
  }
})
