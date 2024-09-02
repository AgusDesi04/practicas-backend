import { Router } from "express";
import ProductsManager from "../dao/productsManager.js";
import fs from "fs"
import { emitProductUpdates } from "../app.js"

const productsRouter = Router()

ProductsManager.path = "./src/data/products.json"

productsRouter.get("/", async (req, res) => {
  try {

    let products = await ProductsManager.getProducts()

    let { limit, skip } = req.query

    // control del limit
    if (limit) {
      limit = Number(limit)
      if (isNaN(limit)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El argumento limit tiene que ser numerico` })
      }
    } else {
      limit = products.length
    }

    // control del skip
    if (skip) {
      skip = Number(skip)
      if (isNaN(skip)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El argumento skip tiene que ser numerico` })
      }
    } else {
      skip = 0
    }

    // RESULTADOS
    let resultado = products.slice(skip, skip + limit)

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ resultado });


  } catch (error) {

    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json(
      {
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`
      }
    )
  }
});

productsRouter.get("/:pid", async (req, res) => {
  let { pid } = req.params

  id = parseInt(pid, 10);
  
  if (isNaN(id)) {
    res.setHeader("content-type", "aplication/json")
    return res.status(400).send("El id debe ser numerico!!")
  }

 

  let products = await ProductsManager.getProducts()

  let product = products.find(p => p.id === id)

  if (!product) {
    res.setHeader("content-type", "aplication/json")
    return res.status(400).send(`El producto con el id: ${id} no se encuentra entre los productos registrados!`)
  }

  res.status(200).json({ product })
})


productsRouter.post("/", async (req, res) => {
  let { title, description, code, price, status, stock, category } = req.body

  // VALIDACIONES

  if (!title || !description || !code || !price || !status || !stock || !category) {
    res.setHeader("content-type", "aplication/json")
    return res.status(400).json({ error: "complete todas las propiedades!" })
  }
  let products = await ProductsManager.getProducts()
  let exists = products.find(p => p.title.toLowerCase() === title.toLowerCase())
  if (exists) {
    res.setHeader("content-type", "aplication/json")
    return res.status(400).json({ error: `ya existe un producto llamado ${title}` })
  }

  // CARGA DEL NUEVO PRODUCTO

  try {
    let newProduct = await ProductsManager.addProducts({ title, description, code, price, status, stock, category })
    res.setHeader("content-type", "aplication/json")
    emitProductUpdates('updateProducts', products)
    return res.status(200).json({ newProduct })

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

productsRouter.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updates = req.body;

    if (isNaN(pid)) {
      res.setHeader("content-type", "aplication/json")
      return res.status(400).json({ error: "El ID debe ser numérico" });
    }

    let products = await ProductsManager.getProducts();

    let productIndex = products.findIndex(p => p.id === parseInt(pid, 10));

    if (productIndex === -1) {
      res.setHeader("content-type", "aplication/json")
      return res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
    }

    let updatedProduct = { ...products[productIndex], ...updates };
    updatedProduct.id = products[productIndex].id;

    products[productIndex] = updatedProduct;

    await fs.promises.writeFile(ProductsManager.path, JSON.stringify(products, null, 5));

    res.setHeader("content-type", "aplication/json")
    res.status(200).json({ updatedProduct });

  } catch (error) {
    console.log(error);
    res.setHeader("content-type", "aplication/json")
    res.status(500).json({
      error: "Error inesperado en el servidor - Intente más tarde, o contacte a su administrador",
      detalle: error.message
    });
  }
});


productsRouter.delete("/:id", async (req, res) => {
  let { id } = req.params

  id = Number(id)

  if (isNaN(id)) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: `id debe ser numerico` })
  }

  try {
    let resultado = await ProductsManager.deleteProducts(id)
    let products = await ProductsManager.getProducts()

    if (resultado > 0) {
      res.setHeader("content-type", "aplication/json")
      emitProductUpdates('updateProducts', products)
      return res.status(200).json({ payload: "producto eliminado" })
    } else {
      res.setHeader("content-type", "aplication/json")
      return res.status(500).json({ error: `error al eliminar!!` })
    }

  } catch (error) {
    console.log(error);
    res.setHeader("content-type", "aplication/json")
    res.status(500).json({
      error: "Error inesperado en el servidor - Intente más tarde, o contacte a su administrador",
      detalle: error.message
    });
  }

})

export default productsRouter