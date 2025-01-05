import { model, models, Schema } from 'mongoose'
import { ProductsPropierties } from '@/utils/interfaces'

const product = new Schema<ProductsPropierties>(
  {
    description: { type: String, required: true },
    name: { type: String, required: true },
    pinned: { type: Boolean, required: true, default: false },
    archived: { type: Boolean, required: false, default: false },
    images: [String],
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export const productModel = models?.products || model('products', product)
