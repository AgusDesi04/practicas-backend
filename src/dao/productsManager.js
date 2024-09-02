import fs from "fs";
import { emitProductUpdates } from "../app.js"

class ProductsManager {
  static path

  static async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data);

    } catch (error) {
      console.error("Error al leer el archivo:", error)
      return [];

    }
  }

  static async addProducts(product = {}) {
    let products = await this.getProducts();

    let id = 1;
    if (products.length > 0) {
      const ids = products.map(d => parseInt(d.id, 10));
      id = Math.max(...ids) + 1;
    }

    let newProduct = {
      id: id,
      ...product
    };

    products.push(newProduct);

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5));


    return newProduct;
  }
  

  static async deleteProducts(id){
    let products = await this.getProducts()

    let indexProduct = products.findIndex(p=>p.id === id)

    if (indexProduct === -1){
      throw new Error(`No existe el id ${id}`)
    }

    let cantidad0 = products.length

    products = products.filter(p=>p.id !==id) 
    
    
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5));

    let cantidad1 = products.length
    
    return cantidad0 - cantidad1

  }
}

export default ProductsManager