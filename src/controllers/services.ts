import type {
  NewAndUpdateServiceProps,
  ServiceResponse,
  ServicesPropierties,
} from '@/utils/interfaces'
import { Types } from 'mongoose'
import { createAndUpdateServiceValidation } from '@/utils/validations'
import { servicesModel } from '@/models/service'
import { Router, type Request, type Response } from 'express'
import { authMiddleware } from '@/middleware'

export const routerService = Router()

routerService.get('/', async (req: Request, res: Response) => {
  try {
    const { id, pinned: onlyPinned } = req.query

    if (id) {
      const product: ServiceResponse | null = await servicesModel.findById(id)
      res.status(200).send(product)
      return
    }

    if (Boolean(onlyPinned == 'true')) {
      const services: ServiceResponse[] = await servicesModel.find({ pinned: true }).sort({ createdAt: -1 })
      res.status(200).send(services)
      return
    }

    const services: ServiceResponse[] = await servicesModel.find().sort({ createdAt: -1 })
    res.status(200).send(services)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

routerService.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const params: ServicesPropierties = req.body
    createAndUpdateServiceValidation.parse(params)

    const newService = await servicesModel.create(params)
    res.status(200).send(newService)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

routerService.delete('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.query
    if (!id || !Types.ObjectId.isValid(String(id))) throw new Error('id is not a valid')

    const deleted = await servicesModel.deleteOne({ _id: id })
    res.status(200).send(deleted)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

routerService.put('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const params: NewAndUpdateServiceProps = req.body
    if (!Types.ObjectId.isValid(params.id)) throw new Error('id is not a valid')

    createAndUpdateServiceValidation.parse(params)
    const serviceUpdated = await servicesModel.updateOne({ _id: params.id }, params)
    res.status(200).send(serviceUpdated)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

