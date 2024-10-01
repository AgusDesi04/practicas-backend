import express from "express";
import { engine } from "express-handlebars";
import path from 'path';
import { Server } from "socket.io";
import ProductsManager from "./src/dao/productsManager.js";
import cartsRouter from "./src/routes/carts.router.js";
import productsRouter from "./src/routes/products.router.js";
import viwesRouter from "./src/routes/views.router.js";
import { connDB } from "./src/connDB.js";


const PORT = 8080

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use(express.static(path.resolve('public')));
app.engine("handlebars", engine({
   runtimeOptions: {
  allowProtoPropertiesByDefault: true, 
  allowProtoMethodsByDefault: true
}}))
app.set("view engine", "handlebars")
app.set("views", "./src/views")
app.use("/", viwesRouter)





const server = app.listen(PORT, () => console.log(`server online en el puerto ${PORT}...!!!`))

const io = new Server(server)

io.on('connection', (socket) => {
  console.log('Cliente conectado');
  ProductsManager.getProducts().then(products => {
    socket.emit('products', products);
  }).catch(error => {
    console.error('Error fetching products:', error);
    socket.emit('products', []);
  });

  socket.on('createProduct', async (product) => {
    try {

      const existingProduct = await ProductsManager.getProductByCode(product.code);
      if (existingProduct) {
        throw new Error('el codigo de producto ya existe')
      }

      await ProductsManager.addProducts(product);
      const products = await ProductsManager.getProducts();
      io.emit('products', products);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      await ProductsManager.deleteProducts(productId);
      const products = await ProductsManager.getProducts();
      io.emit('products', products);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  });
});

connDB()