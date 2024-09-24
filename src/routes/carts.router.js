import { Router } from "express";
import fs from "fs";
import CartsManager from "../dao/cartsManager.js";
import { productsModel } from "../dao/models/productModel.js";
import ProductsManager from "../dao/productsManager.js";


const cartsRouter = Router()

CartsManager.path = "./src/data/carts.json"
ProductsManager.path = "./src/data/products.json"


cartsRouter.post('/', async (req, res) => {

  let products = []

  let carts = await CartsManager.getCarts()



  if (!carts) {
    res.setHeader("content-type", "aplication/json")
    return res.status(400).json({ error: `No se encontro el archivo en el cual agregar carts` })

  }

  try {
    let newCart = await CartsManager.addCarts({ products })
    res.setHeader("content-type", "aplication/json")
    return res.status(200).json({ newCart: `se a generado un nuevo carrito ${newCart}` })

  } catch (error) {
    console.log(error)
    res.setHeader("content-type", "aplication/json")
    return res.status(500).json(
      {
        error: `error inesperado en el servidor!!`,
        detalle: `${error.message}`
      }
    )
  }

})

export default cartsRouter


cartsRouter.get('/:cid', async (req, res) => {

  let { cid } = req.params

  if (!cid) {
    res.setHeader("content-type", "aplication/json")
    return res.status(500).json({ error: "debes colocar un cart id!" })
  }

  try {
    let cart = await CartsManager.getCartsPopulated(cid)
    res.setHeader("content-type", "aplication/json")

    return res.status(200).json({ cart })

  } catch (error) {
    res.setHeader("content-type", "aplication/json")

    return res.status(500).json(
      {
        error: `error inesperado en el servidor!!`,
        detalle: `${error.message}`
      }
    )
  }






})

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  // obtengo el carrito mediante el :cid y el producto mediante el :pid
  let { cid } = req.params
  let { pid } = req.params

  try {

    let addedProduct = await CartsManager.addProductInCart(cid, pid)

    res.setHeader("content-type", "aplication/json")

    return res.status(200).json({ addedProduct })

  } catch (error) {

    console.log(error)

    res.setHeader("content-type", "aplication/json")

    return res.status(500).json(
      {
        error: `error inesperado en el servidor!!`,
        detalle: `${error.message}`
      }
    )

  }

})

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  let { cid } = req.params
  let { pid } = req.params

  try {
    let newCart = await CartsManager.removeProductFromCart(cid, pid)

    res.setHeader("content-type", "aplication/json")

    return res.status(200).json({ newCart })


  } catch (error) {
    res.setHeader("content-type", "aplication/json")

    return res.status(500).json(
      {
        error: `error inesperado en el servidor!!`,
        detalle: `${error.message}`
      }
    )
  }

})

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  let { cid } = req.params
  let { pid } = req.params
  let { quantity } = req.body

  try {

    if (isNaN(quantity) || quantity < 0) {
      res.setHeader("content-type", "aplication/json")
      return res.status(500).json({ error: "la cantidad debe ser un numero positivo" })
    }

    let newCart = await CartsManager.updateQuantity(cid, pid, quantity)

    res.setHeader("content-type", "aplication/json")

    return res.status(200).json({ newCart })

  } catch (error) {
    res.setHeader("content-type", "aplication/json")

    return res.status(500).json(
      {
        error: `error inesperado en el servidor!!`,
        detalle: `${error.message}`
      }
    )
  }
})

cartsRouter.delete("/:cid", async (req, res) => {
  let { cid } = req.params

  if (!cid) {
    res.setHeader("content-type", "aplication/json")
    return res.status(500).json({ error: "debes colocar un cart id!" })
  }

  try {
    let newCart = await CartsManager.deleteAllProducts(cid)

    res.setHeader("content-type", "aplication/json")

    return res.status(200).json({ newCart })

  } catch (error) {
    res.setHeader("content-type", "aplication/json")

    return res.status(500).json(
      {
        error: `error inesperado en el servidor!!`,
        detalle: `${error.message}`
      }
    )
  }

})
