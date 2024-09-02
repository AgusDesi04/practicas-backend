import fs from "fs";
import ProductsManager from "./productsManager.js";


class CartsManager {
  static path

  static async getCarts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data);

    } catch (error) {
      console.error("Error al leer el archivo:", error)
      return [];

    }
  }

  static async addCarts() {
    let carts = await this.getCarts();
    console.log(carts)

    let id = 1;
    if (carts.length > 0) {
      const ids = carts.map(d => parseInt(d.id, 10));
      id = Math.max(...ids) + 1;
    }

    let newCart = {
      id: id,
      products: []
    };

    console.log(newCart)

    carts.push(newCart);

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5));

    return newCart;
  }

  static async addProductInCart(cid, pid) {

    // obtengo todos los carritos y busco el que tenga el mismo id que cartId
    let carts = await CartsManager.getCarts()
    let filteredCart = carts.find(c => c.id === cid)
    
    if(!filteredCart){
      throw new Error(`No se encontro un carrito con el id: ${cid}`)
    }

    // obtengo todos los productos y busco el que tenga el mismo id que productId

    let products = await ProductsManager.getProducts()
    console.log(products)
    let filteredProduct = products.find(p => p.id === pid)
    console.log(filteredProduct)
    if(!filteredProduct){
      throw new Error(`no se encontro un producto con el id: ${pid}`)
    }

    let existingProduct = filteredCart.products.find(p => p.id === pid);
  

    if (existingProduct) {
      // Si el producto ya está en el carrito, incrementar la cantidad
      existingProduct.quantity += 1;
    } else {
      // Si el producto no está en el carrito, agregarlo con quantity 1
      filteredCart.products.push({ id: filteredProduct.id, name: filteredProduct.title, quantity: 1 });
    }

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))

    return filteredCart
  }

}



export default CartsManager