import mongoose from "mongoose";

const cartsColl = 'Carts' 

const cartsSchema = mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true }, 
        quantity: { type: Number, default: 1, min: 0 } 
      }
    ]
  },
  {
    timestamps: true
  }
);


export const cartsModel = mongoose.model(
  cartsColl,
  cartsSchema
)