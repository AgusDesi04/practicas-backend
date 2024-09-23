import { Router } from "express";
import fs from "fs";
import CartsManager from "../dao/cartsManager.js";
import ProductsManager from "../dao/productsManager.js";
import { productsModel } from "../dao/models/productModel.js";


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
    let newCart = await CartsManager.addCarts({products})
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

  try {

    let addedProduct =  await CartsManager.addProductInCart(cid, pid)

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

cartsRouter.delete("/:cid/products/:pid", async (req, res)=>{
  let {cid} = req.params
  let {pid} = req.params

  try {
    let newCart = await CartsManager.removeProductFromCart(cid, pid)

    res.setHeader("content-type", "aplication/json")

    return res.status(200).json({newCart})


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

cartsRouter.put("/:cid/products/:pid", async (req, res)=>{
  let {cid} = req.params
  let {pid} = req.params
  let {quantity} = req.body

  try {

    if(isNaN(quantity) || quantity < 0){
      res.setHeader("content-type", "aplication/json")
      return res.status(500).json({error:"la cantidad debe ser un numero positivo"})
    }

    let newCart = await CartsManager.updateQuantity(cid, pid, quantity)

    res.setHeader("content-type", "aplication/json")

    return res.status(200).json({newCart})

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