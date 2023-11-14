import * as mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "id not found"],
      unique: [true, { message: "id error" }], // Set unique constraint for id
    },
    name: {
      type: String,
      required: [true, "name not found"],
      unique: [true, { message: "name error" }], // Set unique constraint for name
    },
    description: { type: String, required: [true, "description not found"] },
    variant: {
      type: [
        {
          id: {
            type: String,
            required: [true, "variant id not found"],
          },
          variantname: {
            type: String,
            required: [true, "variant name not found"],
          },
          price: {
            type: Number,
            required: [true, "price not found"],
          },
          images: [{
            publicId: {
              type: String,
              required: [true, "image pubilc ID not found "],
            },
            uri: {
              type: String,
              required: [true, "image uri not found"],
            },
        }],
          about: {
            sku: { type: String, required: [true, "sku not found"] },
            weight: { type: Number, required: [true, "weight not found"] },
          },
        },
      ],
      required: [true, "variant not found"],
      validate: {
        validator: function (v: string | any[]) {
          return v.length > 0;
        },
        message: "Variant is required",
      },
    },
    faq:{
      type: [
        {
          question :{type:String ,required:[true,"Question Not Found"]} ,
          answer:{type:String ,required:[true,"Question Not Found"]}
        }
      ]
    },
    review:{type: [
      {type:String, unique: [true, { message: "name error" }]}
    ]}
  },
  
  { timestamps: true }
);
export type Product = mongoose.InferSchemaType<typeof productSchema>;
export const Product = mongoose.model("Product", productSchema);

// price: [
//   {
//     price: { type: Number, required: [true, "price not found"] },
//     variant: { type: String, required: [true, "price variant not found"] },
//     stock: { type: Number, required: [true, "stock not found"] },
//     sku: { type: String, required: [true, "sku not found"] },
//     weight: { type: Number, required: [true, "weight not found"] },
//   },
// ],
// image: [[{ uri: { type: String }, publicId: { type: String } }]],
// faq: [
//   {
//     question: { type: String, required: [true, "question not found"] },
//     answer: { type: String, required: [true, "answer not found"] },
//   },
// ],
// reviews: [String], // Simplified reviews array
