import { Router } from "express";
import ProductsManager from "../dao/productsManager.js";

const viewsRouter = Router()


viewsRouter.get("/products", async (req, res) => {
  let { limit = 10, page = 1, sort = null, filter = null } = req.query

  console.log("filtro:", filter)
  console.log('sort:', sort)

  if (isNaN(Number(page)) || Number(page) < 1) {
    page = 1; 
  }


  if (isNaN(Number(limit)) || Number(limit) < 1) {
    limit = 10; 
  }

  try {
    const productsData = await ProductsManager.getProductsPaginate({
      limit,
      page,
      sort,
      filter
    })

    console.log('productos:', productsData)

    const { docs: products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = productsData

    res.setHeader('Content-Type', 'text/html');
    res.status(200).render("home", {
      products,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      currentPage: page,
      limit,
      sort,
      filter
    })

  } catch (error) {
    console.error("Error al obtener productos:", error)
    res.status(500).send("Error al obtener productos.")
  }

})

viewsRouter.get("/realtimeproducts", async (req, res) => {
  let products = await ProductsManager.getProducts();
  res.status(200).render("realTimeProducts", { products })
});
export default viewsRouter