import type { Elysia } from "elysia";
// import * as mongoose from 'mongoose';
import { Review } from "../../../schema/reviewSchema";
// import { uploadImage } from "../../../lib/imageUpload";

interface BodyType {}

export default function productGroups(app: Elysia, prefix: string) {
  return app.group(
    prefix,
    (app) =>
      app
        //get all reviews
        .get("", async () => {
          const reviews = await Review.find();
          return reviews;
        })
        .onError(({ code, error }) => {
          return new Response(error.toString());
        })
        // get all reviews with product id
        .get("/productId/:id", async ({ params: { id } }) => {
          const reviews = await Review.find({ productId: { $in: [id] } });
          return reviews;
        })
        .post("/review_ids", async ({ body }: any) => {
          console.log(body)
          const reviews = await Review.find({ _id: { $in: body } });
          return(reviews);
        })

        //get review with _id
        .get("/:id", async ({ params: { id } }) => {
          const product = await Review.findOne({ _id: id });
          if (!product) {
            return {
              error: "Product not found",
            };
          }
          return product;
        })
        .post("", async ({ body }: any) => {
          const json = JSON.parse(body);
          const review = new Review(json);
          await review.save();

          const update = await fetch(
            `http://localhost:3000/orders/${review.orderId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json", // Set the content type to JSON
              },
              body: JSON.stringify({
                orderStatus: "review",
              }),
            }
          );
  
          if (update.ok) {
            const updateData = await update.json(); // Call json() as a function
            console.log(updateData);
          } else {
            console.error(`Update request failed with status: ${update.status}`);
          }

          return review;
        })
    //   .put("/:id", async ({ params: { id }, body }) => {
    //     const updateProduct = await Review.findOneAndUpdate(
    //       { id },
    //       { $set: body as BodyType },
    //       { new: true }
    //     );
    //     return updateProduct;
    //   })
  );
}
