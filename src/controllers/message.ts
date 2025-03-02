import type { ArchiveMessageProp, MessagesPropierties } from '@/utils/interfaces'
import { Router, type Request, type Response } from 'express'
import { messageModel } from '@/models/messages'
import { getSocket } from '@/socket'
import { apiLimiterDefault, authMiddleware } from '@/middleware'
import { sendEmail } from '@/services/sendMail'
import { responseError } from '@/utils/errors'
import { createMessageValidation } from '@/utils/validations'

export const routerMessage = Router()

// routerMessage.post('/', apiLimiterDefault, async (req: Request, res: Response) => {
routerMessage.post('/', async (req: Request, res: Response) => {
  try {
    const params = createMessageValidation.parse(req.body)
    const newMessage = await messageModel.create(params)
    getSocket().emit('newMessage', newMessage)

    await sendEmail({
      email: params.email,
      subject: `Mensaje: ${params.fullName}`,
      templateName: 'notification_job'
    })

    res.status(200).send(newMessage)
  } catch (error) {
    responseError(res, error)
  }
})

routerMessage.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const archived = Boolean(req.query.archived === 'true')
    const messages = await messageModel.find({ archived }).sort({ createdAt: -1 })
    res.status(200).send(messages)
  } catch (error) {
    responseError(res, error)
  }
})


routerMessage.put('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { _id }: ArchiveMessageProp = req.body

    const message = await messageModel.findById(_id)
    if (!message) throw new Error('Could not find a message')

    const messageUpdated = await messageModel.updateOne({ _id }, {
      archived: !Boolean(message.archived)
    })

    res.status(200).send(messageUpdated)
  } catch (error) {
    responseError(res, error)
  }
})

routerMessage.put('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { _id }: ArchiveMessageProp = req.body
    const deleted = await messageModel.deleteOne({ _id })
    res.status(200).send(deleted)
  } catch (error) {
    responseError(res, error)
  }
})


