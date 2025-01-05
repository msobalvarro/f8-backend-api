import { ro } from 'express'
import { NextRequest, NextResponse } from 'next/server'
import { existsSync, mkdirSync } from 'fs'
import { writeFile } from 'fs/promises'
import path from 'path'
import { verifyHeaderToken } from '@/utils/validateToken'

export const router = Router

const uploadDir = <string>process.env.PUBLIC_FOLDER

export async function POST(request: NextRequest) {
  try {
    await verifyHeaderToken(request)
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) throw new Error('No files received')
    if (!(file instanceof File)) throw new Error('Invalid file type')

    // const dataFile = new File(String(file))

    // const file: File = isFile ? fileParams : await readFileSync(fileParams, 'utf-8')
    const buffer = Buffer.from(await file?.arrayBuffer())
    const fileExt = path.extname(file?.name).toLocaleLowerCase()

    const allowedTypes = /jpeg|jpg|png/
    const extname = allowedTypes.test(fileExt)
    if (!extname) throw new Error('extension is not allowed')

    const fileName = `${Date.now()}${fileExt}`

    // create folder if not exists
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
    }

    // write filer
    await writeFile(
      path.join(process.cwd(), uploadDir, fileName),
      buffer
    )

    return NextResponse.json({ file: fileName })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
