import express from "express";
import { engine } from "express-handlebars";
import cartsRouter from "./src/routes/carts.router.js";
import productsRouter from "./src/routes/products.router.js";
import viwesRouter from "./src/routes/views.router.js";
import {Server} from "socket.io"
import ProductsManager from "./src/dao/productsManager.js";


const PORT = 8080

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use(express.static('../public'))
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")
app.use("/", viwesRouter)





const server = app.listen(PORT, () => console.log(`server online en el puerto ${PORT}...!!!`))

const io = new Server(server)

io.on('connection', (socket) => {
  console.log('Cliente conectado');
  
  // Enviar todos los productos al conectarse
  socket.emit('products', ProductsManager.getProducts());

  // Crear producto
  socket.on('createProduct', (product) => {
    ProductsManager.addProducts(product);
    io.emit('products', ProductsManager.getProducts());
  });

  // Eliminar producto
  socket.on('deleteProduct', (productId) => {
    ProductsManager.deleteProducts(productId);
    io.emit('products', ProductsManager.getProducts());
  });
});