import { Router } from "express";
import ProductsManager from "../dao/productsManager.js";

const viewsRouter = Router()


viewsRouter.get("/products", async (req, res) => {
  let products = await ProductsManager.getProducts()

  res.setHeader('Content-Type', 'text/html')
  res.status(200).render("home", {
    products
  })
})

viewsRouter.get("/realtimeproducts", async (req, res) => {
  let products = await ProductsManager.getProducts();
  res.status(200).render("realTimeProducts", { products });
});
export default viewsRouter