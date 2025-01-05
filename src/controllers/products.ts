import { productModel } from '@/models/products'
import type {
  ProductsPropierties,
  UpdateProductProps
} from '@/utils/interfaces'
import { Types } from 'mongoose'
import { createAndUpdateProductValidation } from '@/utils/validations'
import { Router, type Response, type Request } from 'express'
import { authMiddleware } from '@/middleware'

export const routerProducts = Router()

routerProducts.get('/', async (req: Request, res: Response) => {
  try {
    const { id, pinned: onlyPinned } = req.query

    if (id) {
      const product: ProductsPropierties | null = await productModel.findById(id)
      res.status(200).send(product)
      return
    }

    if (Boolean(onlyPinned)) {
      const products: ProductsPropierties[] = await productModel.find({ pinned: true }).sort({ createdAt: -1 })
      res.status(200).send(products)
      return
    }

    const products: ProductsPropierties[] = await productModel.find().sort({ createdAt: -1 })
    res.status(200).send(products)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

routerProducts.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const params: ProductsPropierties = req.body
    createAndUpdateProductValidation.parse(params)

    const newProduct = await productModel.create(params)
    res.status(200).send(newProduct)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

routerProducts.delete('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.body

    if (!id || !Types.ObjectId.isValid(String(id))) throw new Error('id is not a valid')
    const deleted = await productModel.deleteOne({ _id: id })
    res.status(200).send(deleted)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

routerProducts.put('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const params: UpdateProductProps = req.body
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
    res.status(200).send(productUpdated)
  } catch (error) {
    res.status(500).send(String(error))
  }
})
