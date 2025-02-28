import { preferencesModel } from '@/models/preferences'
import type {
  PreferencesPropierties,
  UpdatePreferencesProp
} from '@/utils/interfaces'
import {
  createPreferenceValidation,
  updatePreferenceValidation
} from '@/utils/validations'

import { Router, type Request, type Response } from 'express'
import { authMiddleware } from '@/middleware'
import { Types } from 'mongoose'
import { responseError } from '@/utils/errors'

export const routerPreference = Router()

routerPreference.get('/', async (req: Request, res: Response) => {
  try {
    const data = await preferencesModel.find()
    res.status(200).send(data)
  } catch (error) {
    responseError(res, error)
  }
})

routerPreference.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const params: PreferencesPropierties = req.body
    const data = createPreferenceValidation.parse(params)

    const newPreference = await preferencesModel.create(data)
    res.status(200).send(newPreference)
  } catch (error) {
    responseError(res, error)
  }
})

routerPreference.delete('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.query
    if (!id || !Types.ObjectId.isValid(String(id))) throw new Error('id is not a valid')

    const preferenceDeleted = await preferencesModel.deleteOne({ _id: id })
    res.status(200).send(preferenceDeleted)
  } catch (error) {
    responseError(res, error)
  }
})

routerPreference.put('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const params: UpdatePreferencesProp = req.body
    const data = updatePreferenceValidation.parse(params)

    const preferenceUpdated = await preferencesModel.updateOne({ _id: data._id }, { key: data.key, value: data.value })
    res.status(200).send(preferenceUpdated)
  } catch (error) {
    responseError(res, error)
  }
})

