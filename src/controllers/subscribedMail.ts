import { apiLimiter, apiLimiterDefault } from '@/middleware'
import { subscribeMailsModel } from '@/models/subscribed_mail'
import { responseError } from '@/utils/errors'
import { subscribeMailValidation, unsubscribeMailValidation } from '@/utils/validations'
import { Router, type Request, type Response } from 'express'

export const subscribedMailRouter = Router()

subscribedMailRouter.post('/subscribe', apiLimiterDefault, async (req: Request, res: Response) => {
  try {
    const { email } = subscribeMailValidation.parse(req.body)
    const subscribed = await subscribeMailsModel.create({ email })
    res.send(subscribed)
  } catch (error) {
    responseError(res, error)
  }
})

subscribedMailRouter.post('/unsubscribe', apiLimiter(1), async (req: Request, res: Response) => {
  try {
    const { id } = unsubscribeMailValidation.parse(req.body)
    const unsubscribed = await subscribeMailsModel.updateOne({ _id: id }, { active: false })
    res.send(unsubscribed)
  } catch (error) {
    responseError(res, error)
  }
})
