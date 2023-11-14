import * as mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    orderID: {
      type: String,
      unique: true,
      default: () => {
        // Generate a unique 8-character order ID using ObjectId
        const orderID = new mongoose.Types.ObjectId().toHexString().slice(0, 8);
        return orderID.toUpperCase(); // Convert to uppercase if needed
      },
    },
    user: {
      uid: { type: String },
      name: { type: String },
      email: { type: String },
      phoneNumber: { type: String },
      address: { type: String },
      pincode: { type: String },
      city: { type: String },
      state: { type: String },
      landMark: { type: String },
    },
    items: [
      {
        id: { type: String },
        quantity: { type: Number },
        variant: { type: String },
        image: { type: String },
      },
    ],
    paymentMethod: { type: String },
    orderStatus: { type: String },
    shipmentID: {type: String },
  },
  { timestamps: true }
);
export type Order = mongoose.InferSchemaType<typeof orderSchema>;
export const Order = mongoose.model("Order", orderSchema);

// {
//     uid: {
//       type: String,
//       required: [true, "uid not found"],
//       unique: [true, { message: "uid error" }],
//     },
//     username: {type:String},
//     email: {type:String},
//     phone: {type:String,required: [true, "phone not found"]},
//     addresses: {
//         address:{
//             type:String
//         },
//         landmark:{
//             type:String
//         },
//         pincode:{
//             type:String
//         },
//         city:{
//             type:String
//         },
//         state:{
//             type:String
//         } ,
//         country:{
//             type:String
//         }
//     },
//     orders: [{
//         order_id :{type:String},
//     }],
//   },
