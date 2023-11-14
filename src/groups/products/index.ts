import type { Elysia } from "elysia";
// import * as mongoose from 'mongoose';
import { Product } from "../../../schema/productSchema";

interface BodyType {}



export default function productGroups(app: Elysia, prefix: string) {
  return app.group(prefix, (app) =>
    app
      .get("", async () => {
        const products = await Product.find();
        return products;
      }
      )
      .onError(({ code, error }) => {
        return new Response(error.toString());
      })
      .get("/:id", async ({ params: { id } }) => {
        const product = await Product.findOne({ id: id });
        if (!product) {
          return {
            error: "Product not found",
          };
        }
        return(product);
      })
      .post("", async ({ body }) => {
        // create new product
        const product = new Product(body);
        await product.save();
        return product;
      })
      .put("/:id", async ({ params: { id }, body }) => {
        const updateProduct = await Product.findOneAndUpdate(
          { id },
          { $set: body as BodyType },
          { new: true }
        );
        return updateProduct;
      })
  );
}
