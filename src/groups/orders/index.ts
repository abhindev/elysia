import type { Elysia } from "elysia";
import { Order } from "../../../schema/orderSchema";
import { PhonePe } from "../../../lib/phonepe";
import { shiprocket } from "../../../lib/shiprocket";
import { Delhivery, Track } from "../../../lib/delhivery";

const orders = await Order.find();

interface BodyType {}

// Filtering function to filter products
// filter products with 'orderStatus' equal to 'created' and 'paymentMethod' equal to 'Prepaid'

function filterProducts(
  orders: any,
  orderStatus: string,
  paymentMethod: string
) {
  return orders.filter((order: any) => {
    // Check if the product matches the specified criteria
    const statusMatch = orderStatus ? order.orderStatus === orderStatus : true;
    const methodMatch = paymentMethod
      ? order.paymentMethod === paymentMethod
      : true;

    return statusMatch && methodMatch;
  });
}

export default function orderGroups(app: Elysia, prefix: string) {
  return app.group(prefix, (app) =>
    app
      .get("", async () => {
        const orders = await Order.find();
        return orders.reverse();
      })
      .get("/fillter", ({ query }: any) => {
        return filterProducts(
          orders,
          query.orderStatus,
          query.paymentMethod
        );
        // return "filteredProducts";
      })
      .post("", async ({ body, set }) => {
        const order = new Order(body);
        await order.save();
        if (order.paymentMethod == "Prepaid") {
          const result = await PhonePe({ order });
          console.log(result)
          return result;
        } else {
          const result:any = await Delhivery(order.orderID);
          console.log(result)
          return `http://localhost:3000/success/${order.orderID}`;
        }
      })
      .get("/:id", async ({ params: { id } }) => {
        const order = await Order.findOne({ orderID: id });
        if (!order) {
          return {
            error: "order not found",
          };
        }
        return order;
      })
      .put("/:id", async ({ params: { id }, body }) => {
        const updateorder = await Order.findOneAndUpdate(
          { orderID: id },
          { $set: body as BodyType },
          { new: true }
        );
        return updateorder;
      })
      .get("/user/:id", async ({ params: {id}})=>{
        const order = await Order.find({ 'user.uid': id });
        if (!order) {
          return {
            error: "user has no orders",
          };
        }
        
        return order;
      })
      .get("/track/:id", async ({ params: {id}})=>{
        const result = await Track(id)
        return result;
      })
      .delete("/:id", async ({ params: {id}})=>{
        const order = await Order.findOneAndDelete({ orderID: id });
        if (!order) {
          return {
            error: "order not found",
          };
        }
        return order;
      })
  );
}
