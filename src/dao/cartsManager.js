import { cartsModel } from "./models/cartsModel.js";
import { productsModel } from "./models/productModel.js";



class CartsManager {
  static path

  static async getCarts() {
    try {
      return cartsModel.find();

    } catch (error) {
      console.error("Error al leer el archivo:", error)
      return [];

    }
  }

  static async addCarts(cart = {}) {

    let newCart = cartsModel.create(cart)
    return newCart

  }

  static async addProductInCart(cid, pid) {

    // obtengo todos los carritos y busco el que tenga el mismo id que cartId
    let cart = await cartsModel.findById(cid)

    if (!cart) {
      throw new Error(`No se encontro un carrito con el id: ${cid}`)
    }

    // obtengo todos los productos y busco el que tenga el mismo id que productId

    let product = await productsModel.findById(pid)
    console.log(`producto a insertar${product}`)
    if (!product) {
      throw new Error(`no se encontro un producto con el id: ${pid}`)
    }

    let existingProduct = cart.products.find(p => p.product.toString() === pid)



    if (existingProduct) {
      // Si el producto ya está en el carrito, incrementar la cantidad
      existingProduct.quantity += 1;
    } else {
      // Si el producto no está en el carrito, agregarlo con quantity 1
      cart.products.push({ product: product._id, quantity: 1 })
    }

    await cart.save()

    return cart
  }

  static async removeProductFromCart(cid, pid) {
    let cart = await cartsModel.findById(cid)

    if (!cart) {
      throw new Error('No se encontro el carrito con ese id!!')
    }

    cart.products = await cart.products.filter(p => p.product.toString() !== pid)

    await cart.save()

    return cart
  }

  static async updateQuantity(cid, pid, newQuantity) {
    let cart = await cartsModel.findById(cid)

    if (!cart) {
      throw new Error('no se a encontrado un carrito con ese id')
    }

    let toUpdateProduct = await cart.products.find(p => p.product.toString() === pid)
    if (!toUpdateProduct) {
      throw new Error("no se ha encontrado un producto con ese id!!")
    }
    console.log(`producto a actualizar = ${toUpdateProduct}`)


    toUpdateProduct.quantity = newQuantity

    await cart.save()

    return toUpdateProduct



  }

  static async deleteAllProducts(cid){
    let cart = await cartsModel.findById(cid)

    cart.products = []

    cart.save()

    return cart
  }

  static async getCartsPopulated(cid){
    let populatedCart = await cartsModel.findById(cid).populate("products.product")
    return populatedCart
  }

}



export default CartsManager