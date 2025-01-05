import { NextRequest, NextResponse } from 'next/server'
import { preferencesModel } from '@/models/preferences'
import {
  DeletePreferencesProp,
  PreferencesPropierties,
  UpdatePreferencesProp
} from '@/utils/interfaces'
import {
  createPreferenceValidation,
  deletePreferenceValidation,
  updatePreferenceValidation
} from '@/utils/validations'
import { verifyHeaderToken } from '@/utils/validateToken'
import { validateErrorResponse } from '@/utils/responseError'

export async function GET() {
  try {
    const data = await preferencesModel.find()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return validateErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyHeaderToken(request)
    const params: PreferencesPropierties = await request.json()
    const data = createPreferenceValidation.parse(params)

    const newPreference = await preferencesModel.create(data)
    return NextResponse.json(newPreference, { status: 200 })
  } catch (error) {
    return validateErrorResponse(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await verifyHeaderToken(request)
    const params: DeletePreferencesProp = await request.json()
    const data = deletePreferenceValidation.parse(params)

    const newPreference = await preferencesModel.deleteOne({ _id: data._id })
    return NextResponse.json(newPreference, { status: 200 })
  } catch (error) {
    return validateErrorResponse(error)
  }
}


export async function PUT(request: NextRequest) {
  try {
    await verifyHeaderToken(request)
    const params: UpdatePreferencesProp = await request.json()
    const data = updatePreferenceValidation.parse(params)

    const preferenceUpdated = await preferencesModel.updateOne({ _id: data._id }, { key: data.key, value: data.value })
    return NextResponse.json(preferenceUpdated, { status: 200 })
  } catch (error) {
    return validateErrorResponse(error)
  }
}
