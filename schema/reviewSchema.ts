import * as mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    uid: { type: String, require: [true, "uid not found"] },
    orderId: {
      type: String,
      require: [true, "order id not found"],
      unique: [true, { message: "id error" }],
    },
    productId: [],
    review: {
      username: {
        type: String,
        required: [true, "user name not found"],
      },
      rating: { type: Number, require: [true, "rating"] },
      reviewText: { type: String, required: [true, "reviewText not found"] },
      reviewImage: [{ publicID: { type: String }, uri: { type: String } }],
    },
  },
  { timestamps: true }
);
export type Review = mongoose.InferSchemaType<typeof reviewSchema>;
export const Review = mongoose.model("Review", reviewSchema);
