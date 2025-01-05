import type { Request, Response } from 'express'
import { Router } from 'express'
import { createReadStream } from 'fs'
import { resolve } from 'path'
import { promises as fsPromises } from 'fs'
import mime from 'mime-types'

const app = Router()

app.get('/:imageName', async (req: Request, res: Response) => {
  const { imageName } = req.params
  const imagePath = resolve(`${process.env.PUBLIC_FOLDER}/${imageName}`)

  try {
    // Verifica si el archivo existe
    await fsPromises.access(imagePath)

    // Obtén el tipo MIME según la extensión del archivo
    const mimeType = mime.lookup(imagePath)
    if (!mimeType) {
      return res.status(400).json({ error: 'Tipo de archivo no soportado.' })
    }

    const stream = createReadStream(imagePath)
    res.setHeader('Content-Type', mimeType)
    stream.pipe(res)
  } catch (error) {
    console.error(error)
    res.status(404).json({ error: 'Imagen no encontrada.' })
  }
})
