import { productModel } from '@/models/products'
import {
  ProductsPropierties,
  UpdateProductProps
} from '@/utils/interfaces'
import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { createAndUpdateProductValidation } from '@/utils/validations'
import { validateErrorResponse } from '@/utils/responseError'
import { verifyHeaderToken } from '@/utils/validateToken'

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    const onlyPinned = request.nextUrl.searchParams.get('pinned')

    if (id) {
      const product: ProductsPropierties | null = await productModel.findById(id)
      return NextResponse.json(product, { status: 200 })
    }

    if (Boolean(onlyPinned)) {
      const products: ProductsPropierties[] = await productModel.find({ pinned: true }).sort({ createdAt: -1 })
      return NextResponse.json(products, { status: 200 })
    }

    const products: ProductsPropierties[] = await productModel.find().sort({ createdAt: -1 })
    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    console.log(error)
    
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyHeaderToken(request)
    const params: ProductsPropierties = await request.json()
    createAndUpdateProductValidation.parse(params)

    const newProduct = await productModel.create(params)
    return NextResponse.json(newProduct)
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


    const deleted = await productModel.deleteOne({ _id: id })
    return NextResponse.json(deleted)
  } catch (error) {
    return validateErrorResponse(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    await verifyHeaderToken(request)
    const params: UpdateProductProps = await request.json()
    const data = createAndUpdateProductValidation.parse(params)
    if (!Types.ObjectId.isValid(params.id)) throw new Error('id is not a valid')


    const productUpdated = await productModel.updateOne(
      { _id: params.id },
      {
        description: data.description,
        name: data.name,
        archived: params.archived,
        pinned: params.pinned,
        images: data.images,
      }
    )
    return NextResponse.json(productUpdated)
  } catch (error) {
    return validateErrorResponse(error)
  }
}
