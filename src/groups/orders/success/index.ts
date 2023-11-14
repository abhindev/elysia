import type { Elysia } from "elysia";

import { Order } from "../../../../schema/orderSchema";

import { shiprocket } from "../../../../lib/shiprocket";
import { getPhonePeStatus } from "../../../../lib/phonepe";
import { Delhivery } from "../../../../lib/delhivery";
// import { pushToUserOrders } from "../../../../lib/pushorder";


export default function successGroups(app: Elysia, prefix: string) {
  return app.group(prefix, (app) =>
    app.get("/:id", async ({ params: { id }, set }) => {
      const order = await Order.findOne({ orderID: id });
      const shipmentID = order?.shipmentID;
      if (shipmentID == undefined) {
        if (order?.paymentMethod == "Prepaid") {
          const phonePe:any = await getPhonePeStatus(id);
          const success = phonePe.success;
          if (success) {
            // const ship:any = await shiprocket(id);
            const ship:any =await Delhivery(id)
            const shipmentID = ship.packages[0].waybill;
            const order = await Order.findOneAndUpdate(
              { orderID: id },
              { orderStatus: "success", shipmentID },
              { new: true }
            );
            // const result = await pushToUserOrders(id)
            // TODO: Send email to customer
            set.redirect = `http://localhost:3000/success/${id}`;
          }
        } else {
          // const ship:any = await shiprocket(id);
          // const shipmentID = ship.shipment_id;
          const ship:any = await Delhivery(id);
          const shipmentID = ship.packages[0].waybill;
          const order = await Order.findOneAndUpdate(
            { orderID: id },
            { orderStatus: "success", shipmentID },
            { new: true }
          );
          // TODO: Send email to customer
          // const result = await pushToUserOrders(id)
          set.redirect = `http://localhost:3000/success/${id}`;
        }
      } else {
        console.log("error")
        // set.redirect = `http://localhost:3000/success/${id}`;
      }
    })
    .post("/:id", async ({ params: { id }, set }) => {
      const order = await Order.findOne({ orderID: id });
      const shipmentID = order?.shipmentID;
      if (shipmentID == undefined) {
        if (order?.paymentMethod == "Prepaid") {
          const phonePe:any = await getPhonePeStatus(id);
          const success = phonePe.success;
          if (success) {
            // const ship:any = await shiprocket(id);
            const ship:any =await Delhivery(id)
            const shipmentID = ship.packages[0].waybill;
            const order = await Order.findOneAndUpdate(
              { orderID: id },
              { orderStatus: "success", shipmentID },
              { new: true }
            );
            // const result = await pushToUserOrders(id)
            // TODO: Send email to customer
            set.redirect = `http://localhost:3000/success/${id}`;
          }
        } else {
          // const ship:any = await shiprocket(id);
          // const shipmentID = ship.shipment_id;
          const ship:any = await Delhivery(id);
          const shipmentID = ship.packages[0].waybill;
          const order = await Order.findOneAndUpdate(
            { orderID: id },
            { orderStatus: "success", shipmentID },
            { new: true }
          );
          // TODO: Send email to customer
          // const result = await pushToUserOrders(id)
          set.redirect = `http://localhost:3000/success/${id}`;
        }
      } else {
        console.log("error")
        // set.redirect = `http://localhost:3000/success/${id}`;
      }
    })
  );
}
