import {
  NewAndUpdateServiceProps,
  ServicesPropierties,
} from '@/utils/interfaces'
import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { createAndUpdateServiceValidation } from '@/utils/validations'
import { validateErrorResponse } from '@/utils/responseError'
import { servicesModel } from '@/models/service'
import { verifyHeaderToken } from '@/utils/validateToken'

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    const onlyPinned = request.nextUrl.searchParams.get('pinned')

    if (Boolean(onlyPinned)) {
      const services: ServicesPropierties[] = await servicesModel.find({ pinned: true }).sort({ createdAt: -1 })
      return NextResponse.json(services, { status: 200 })
    }

    if (id) {
      const product: NewAndUpdateServiceProps | null = await servicesModel.findById(id)
      return NextResponse.json(product, { status: 200 })
    }

    const products: NewAndUpdateServiceProps[] = await servicesModel.find().sort({ createdAt: -1 })
    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    console.log(error)

    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyHeaderToken(request)
    const params: ServicesPropierties = await request.json()
    createAndUpdateServiceValidation.parse(params)

    const newService = await servicesModel.create(params)
    return NextResponse.json(newService)
  } catch (error) {
    return validateErrorResponse(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await verifyHeaderToken(request)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id || !Types.ObjectId.isValid(id)) throw new Error('id is not a valid')


    const deleted = await servicesModel.deleteOne({ _id: id })
    return NextResponse.json(deleted)
  } catch (error) {
    return validateErrorResponse(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    await verifyHeaderToken(request)
    const params: NewAndUpdateServiceProps = await request.json()
    if (!Types.ObjectId.isValid(params.id)) throw new Error('id is not a valid')
    createAndUpdateServiceValidation.parse(params)
    const serviceUpdated = await servicesModel.updateOne({ _id: params.id }, params)
    return NextResponse.json(serviceUpdated)
  } catch (error) {
    return validateErrorResponse(error)
  }
}
