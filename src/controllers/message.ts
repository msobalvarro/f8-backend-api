
import { NextRequest, NextResponse } from 'next/server'
import { ArchiveMessageProp, MessagesPropierties } from '@/utils/interfaces'
import { createMessage } from '@/utils/validations'
import { messageModel } from '@/models/messages'
import { getSocket } from '@/utils/socket'
import { verifyHeaderToken } from '@/utils/validateToken'
import { validateErrorResponse } from '@/utils/responseError'

export async function POST(request: NextRequest) {
  try {
    // await verifyHeaderToken(request)
    const params: MessagesPropierties = await request.json()
    const data = createMessage.parse(params)

    const newMessage = await messageModel.create(data)

    getSocket().emit('newMessage', newMessage)

    return NextResponse.json(newMessage, { status: 200 })
  } catch (error) {
    return validateErrorResponse(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    await verifyHeaderToken(request)

    const archived = request.nextUrl.searchParams.get('archived') === 'true'
    const data = await messageModel.find({ archived }).sort({ createdAt: -1 })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return validateErrorResponse(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    await verifyHeaderToken(request)

    const { _id }: ArchiveMessageProp = await request.json()

    const message = await messageModel.findById(_id)
    if (!message) throw new Error('Could not find a message')

    const messageUpdated = await messageModel.updateOne({ _id }, {
      archived: !Boolean(message.archived)
    })

    return NextResponse.json(messageUpdated, { status: 200 })
  } catch (error) {
    return validateErrorResponse(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await verifyHeaderToken(request)
    const { _id }: ArchiveMessageProp = await request.json()

    const deleted = await messageModel.deleteOne({ _id })

    return NextResponse.json(deleted, { status: 200 })
  } catch (error) {
    return validateErrorResponse(error)
  }
}

