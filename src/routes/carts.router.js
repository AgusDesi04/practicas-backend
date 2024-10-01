import { Router } from "express";
import fs from "fs";
import CartsManager from "../dao/cartsManager.js";
import { cartsModel } from "../dao/models/cartsModel.js";
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
    res.setHeader("content-type", "application/json");
    return res.status(201).json({ idCart: newCart._id, message: 'Se ha generado un nuevo carrito.' });

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

cartsRouter.put("/:cid", async (req, res) => {
  let { cid } = req.params;
  let { products } = req.body; 

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "Se debe proporcionar un array de productos." });
  }

  try {

    let cart = await CartsManager.getCartsPopulated(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    const existingProducts = await ProductsManager.getProducts();
    const existingProductIds = existingProducts.map(product => product._id.toString());

    const validProducts = products.filter(item => {
      return existingProductIds.includes(item.product) && item.quantity > 0;
    });

    if (validProducts.length === 0) {
      return res.status(400).json({ error: "No se proporcionaron productos válidos para agregar al carrito." });
    }

    cart.products = validProducts.map(item => ({
      product: item.product,
      quantity: item.quantity,
    }));


    await CartsManager.updateCart(cart);

    return res.status(200).json({ message: "Carrito actualizado con éxito.", cart });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error inesperado en el servidor.",
      detalle: error.message,
    });
  }
});