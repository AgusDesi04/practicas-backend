import express from "express";
import { engine } from "express-handlebars";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import viwesRouter from "./routes/views.router.js";
import {Server} from "socket.io"


const PORT = 8080

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use(express.static('public'))
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")
app.use("/", viwesRouter)





const server = app.listen(PORT, () => console.log(`server online en el puerto ${PORT}...!!!`))

const io = new Server(server)

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  

});

export const emitProductUpdates = (event, products) => {
  io.emit(event, products);
};