import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productsColl = 'Products'

const productsSchema = mongoose.Schema(

  {
    title: String,
    description: String,
    code: { type: String, required: true, unique: true },
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: []
  },
  {
    timestamps: true,
  }

)

productsSchema.plugin(paginate)

export const productsModel = mongoose.model(
  productsColl,
  productsSchema
)