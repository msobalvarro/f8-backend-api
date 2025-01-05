import { preferencesModel } from '@/models/preferences'
import type {
  DeletePreferencesProp,
  PreferencesPropierties,
  UpdatePreferencesProp
} from '@/utils/interfaces'
import {
  createPreferenceValidation,
  deletePreferenceValidation,
  updatePreferenceValidation
} from '@/utils/validations'

import { Router, type Request, type Response } from 'express'
import { authMiddleware } from '@/middleware'

export const routerPreference = Router()

routerPreference.get('/', async (req: Request, res: Response) => {
  try {
    const data = await preferencesModel.find()
    res.status(200).send(data)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

routerPreference.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const params: PreferencesPropierties = req.body
    const data = createPreferenceValidation.parse(params)

    const newPreference = await preferencesModel.create(data)
    res.status(200).send(newPreference)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

routerPreference.delete('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const params: DeletePreferencesProp = req.body
    const data = deletePreferenceValidation.parse(params)

    const preferenceDeleted = await preferencesModel.deleteOne({ _id: data._id })
    res.status(200).send(preferenceDeleted)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

routerPreference.put('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const params: UpdatePreferencesProp = req.body
    const data = updatePreferenceValidation.parse(params)

    const preferenceUpdated = await preferencesModel.updateOne({ _id: data._id }, { key: data.key, value: data.value })
    res.status(200).send(preferenceUpdated)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

