import { apiLimiter, apiLimiterDefault } from '@/middleware'
import { subscribeMailsModel } from '@/models/subscribed_mail'
import { subscribedMailValidation } from '@/utils/validations'
import { Router, type Request, type Response } from 'express'

export const subscribedMailRouter = Router()

subscribedMailRouter.post('/subscribe', apiLimiterDefault, async (req: Request, res: Response) => {
  try {
    const { email } = subscribedMailValidation.parse(req.body)
    const subscribed = await subscribeMailsModel.create({ email })
    res.send(subscribed)
  } catch (error) {
    res.status(500).send(`${error}`)
  }
})

subscribedMailRouter.post('/unSubscribe', apiLimiter(1), async (req: Request, res: Response) => {
  try {
    const { email } = subscribedMailValidation.parse(req.body)
    const subscribed = await subscribeMailsModel.updateOne({ email }, { active: false })
    res.send(subscribed)
  } catch (error) {
    res.status(500).send(`${error}`)
  }
})


