import * as mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      unique: true,
      default: () => {
        // Generate a unique 8-character order ID using ObjectId
        const orderID = new mongoose.Types.ObjectId().toHexString().slice(0, 8);
        return orderID.toUpperCase(); // Convert to uppercase if needed
      },
    },
    messageFor:{
        type:String,
        required:[true,"Please provide messageFor"]
    },
    requestId:{
        type:String,
        required:[true,"Please provide requestId as uid or orderId"],
    },
    message:{
        type:String,
        required:[true,"Please provide messageFor"]
    },
    resolve: {type:Boolean},
  },
  { timestamps: true }
);
export type Message = mongoose.InferSchemaType<typeof messageSchema>;
export const Message = mongoose.model("Message", messageSchema);
