import { createReadStream } from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import { resolve } from 'path'
import { ReadableStream } from 'web-streams-polyfill/ponyfill'

export async function GET(request: NextRequest) {
  // console.log()
  const imageName = request.nextUrl.pathname.split('/')[3]

  const imagePath = resolve(`${process.env.PUBLIC_FOLDER}/${imageName}`)
  try {
    const fs = await import('fs/promises')
    await fs.access(imagePath)

    const stream = createReadStream(imagePath)

    const readableStream = new ReadableStream({
      start(controller) {
        stream.on('data', chunk => controller.enqueue(chunk))
        stream.on('end', () => controller.close())
        stream.on('error', err => controller.error(err))
      }
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'image/jpeg', // Cambia según el tipo de imagen
      },
    })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
