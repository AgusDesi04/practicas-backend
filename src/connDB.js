import mongoose from "mongoose";
import ProductsManager from "./dao/productsManager.js";

export const connDB = async ()=>{
  try {
    await mongoose.connect(
      "mongodb+srv://agusdesi2004:db-agusdesi@cluster0.lsd1h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {dbName:"practicas-backend"}
    )
    console.log('DB CONECTADA!!')
  } catch (error) {
    console.log(`error!! no se pudo conectar a la base de datos!! ${error}`)
  }
}