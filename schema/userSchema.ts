import * as mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: [true, "uid not found"],
      unique: [true, { message: "uid error" }],
    },
    username: {type:String},
    email: {type:String},
    phone: {type:String,required: [true, "phone not found"]},
    addresses: {
        address:{
            type:String
        },
        landmark:{
            type:String
        },
        pincode:{
            type:String
        },
        city:{
            type:String
        },
        state:{
            type:String
        } ,
        country:{
            type:String
        }
    },
    // orders: [{
    //     orderID :{type:String},
    //     orderStatus:{type:String},
    //     shipmentID:{type:String},
    //     items:[{
    //         id:{type:String} ,
    //         quantity:{type:Number},
    //         variant:{type:String} ,
    //         image:{type:String},
    //     }]
    // }],
  },
  { timestamps: true }
);
export type User = mongoose.InferSchemaType<typeof userSchema>;
export const User = mongoose.model("User", userSchema);
