import { Router } from "express";
import fs from "fs";
import CartsManager from "../dao/cartsManager.js";
import ProductsManager from "../dao/productsManager.js";


const cartsRouter = Router()

CartsManager.path = "./src/data/carts.json"
ProductsManager.path = "./src/data/products.json"


cartsRouter.post('/', async (req, res) => {

  let carts = await CartsManager.getCarts()

  if (!carts) {
    res.setHeader("content-type", "aplication/json")
    return res.status(400).json({ error: `No se encontro el archivo en el cual agregar carts` })

  }

  try {
    let newCart = await CartsManager.addCarts()
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

  let id = parseInt(cid, 10)

  if (isNaN(id)) {
    res.setHeader("content-type", "aplication/json")
    return res.status(400).send("El id debe ser numerico!!")
  }

  let carts = await CartsManager.getCarts()

  let filteredCart = carts.find(c => c.id === id)

  if (!filteredCart) {
    res.setHeader("content-type", "aplication/json")
    return res.status(400).send(`El Carrito con el id: ${id} no se encuentra entre los Carritos registrados!`)
  }

  let products = filteredCart.products

  res.status(200).json({ products })


})

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  // obtengo el carrito mediante el :cid y el producto mediante el :pid
  let { cid } = req.params
  let { pid } = req.params
  let cartId = parseInt(cid, 10)
  let productId = parseInt(pid, 10)

  // validaciones de los id
  if (isNaN(cartId)) {
    res.setHeader("content-type", "aplication/json")
    return res.status(400).send("El id del carrito debe ser numerico!!")
  }
  if (isNaN(productId)) {
    res.setHeader("content-type", "aplication/json")
    return res.status(400).send("El id del producto debe ser numerico!!")
  }


  try {

    let addedProduct =  await CartsManager.addProductInCart(cartId, productId)

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