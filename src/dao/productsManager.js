import fs from "fs";
import { productsModel } from "./models/productModel.js";


class ProductsManager {
  static path

  static async getProducts() {
    try {
      const products = await productsModel.find()
      return products

    } catch (error) {
      console.error("Error al leer el archivo:", error)
      return [];

    }
  }

  static async getProductsPaginate(page){
    return await productsModel.paginate({},{lean:true, page})
  }

  static async addProducts(product = {}) {


    let newProduct = productsModel.create(product);

    return newProduct;
  }


  static async deleteProducts(id) {
    const newProducts = productsModel.deleteOne({_id: id})

    return newProducts
  }
}

export default ProductsManager