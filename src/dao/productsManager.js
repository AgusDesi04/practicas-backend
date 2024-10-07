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

  static async getProductsPaginate({ limit = 10, page = 1, sort = null, filter = null }) {
    try {

      const query = {}
      if (filter) {
        Object.keys(filter).forEach(key => {
          query[key] = filter[key]
        })
      }



      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        lean: true,
      }

      if (sort) {
        options.sort = { [sort]: 1 }
      }

      const products = await productsModel.paginate(query, options)

      return products


    } catch (error) {
      console.error("Error al obtener productos paginados:", error);
      return { docs: [], totalPages: 0 };
    }
  }

  static async getProductByCode(code) {
    try {
      return await productsModel.findOne({ code }); // Busca un producto por su código
    } catch (error) {
      console.error("Error al buscar el producto:", error);
      return null; // Retorna null si hay un error
    }
  }

  static async addProducts(product = {}) {

    let newProduct = productsModel.create(product);

    return newProduct;
  }


  static async deleteProducts(id) {
    const newProducts = productsModel.deleteOne({ _id: id })

    return newProducts
  }

  static async updateProduct(id, productUpdates) {
    try {
        
      const updatedProduct = await productsModel.findByIdAndUpdate(id, productUpdates, { new: true });

      if (!updatedProduct) {
        throw new Error(`No se encontró el producto con ID: ${id}`);
      }

      return updatedProduct;
    } catch (error) {
      console.error(`Error al actualizar el producto con ID: ${id}`, error);
      throw error;
    }
  }
}

export default ProductsManager