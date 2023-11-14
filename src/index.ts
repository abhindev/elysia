import { Elysia } from "elysia";
import * as mongoose from "mongoose";
import { Product } from "../schema/productSchema";

await mongoose.connect(
  "mongodb+srv://vihara:adam@cluster0.hwtgiry.mongodb.net/kalayaniammas_v2_2?retryWrites=true&w=majority"
);


const app = new Elysia();
app.get("/", () => "Hello Elysia")
app.get("/products", async () => {
  const products = await Product.find();
  return products;
})

app.listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
