
import { Router, type Request, type Response } from 'express'
import type { ArchiveMessageProp, MessagesPropierties } from '@/utils/interfaces'
import { messageModel } from '@/models/messages'
import { getSocket } from '@/socket'
import { apiLimiter, authMiddleware } from '@/middleware'

export const routerMessage = Router()

routerMessage.use(apiLimiter)

routerMessage.post('/', async (req: Request, res: Response) => {
  try {
    // await verifyHeaderToken(request)
    const params: MessagesPropierties = req.body
    const newMessage = await messageModel.create(params)

    getSocket().emit('newMessage', newMessage)

    res.status(200).send(newMessage)
  } catch (error) {
    console.log(error)
    res.status(500).send(String(error))
  }
})

routerMessage.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const archived = Boolean(req.query.archived)
    console.log(archived)
    
    const messages = await messageModel.find({ archived }).sort({ createdAt: -1 })

    res.status(200).send(messages)
  } catch (error) {
    res.status(500).send(String(error))
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
    res.status(500).send(String(error))
  }
})

routerMessage.put('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { _id }: ArchiveMessageProp = req.body
    const deleted = await messageModel.deleteOne({ _id })
    res.status(200).send(deleted)
  } catch (error) {
    res.status(500).send(String(error))
  }
})


