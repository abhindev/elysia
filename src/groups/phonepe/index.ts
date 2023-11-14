import type { Elysia } from "elysia";
import axios from 'axios'
import crypto from "crypto";


const getStatus = async (transactionId: string)=> {
    const salt = process.env.SALT_KEY;
    const index = process.env.INDEX;
    const merchantId = 'MERCHANTUAT'
    const merchantTransactionId = transactionId
  
    console.log(merchantTransactionId)
  
    const sha256 = crypto
    .createHash("sha256")
    .update(`/pg/v1/status/${merchantId}/${merchantTransactionId}${salt}`)
    .digest("hex");
    const verify = `${sha256}###${index}`
  
    try{
      const response = await fetch(
        `${process.env.PHONEPE_URL}/status/${merchantId}/${merchantTransactionId}`,
      {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": verify,
            "X-MERCHANT-ID": merchantId
          },
        }
        );
        const data = await response.json();
        console.log(data)
        return (data);
      } catch (error) {
        console.log(`Error fetching transaction status ${error}`);
        return (null);
      }
  
  }

export default function phonepeResGroups(app: Elysia, prefix: string) {
  return app.group(prefix, (app) => app.get("", () => 'users')
  .get("/:id", async ({ params: { id } ,set}) => {
    const res:any = await getStatus(id)
    const success = res.success

    if(success){
      const responce = await axios.post(`http://localhost:3000/orders/shiprocket/${id}`)
      const shipmentID = responce.data.data.shipment_id
      if(shipmentID){
        const update = await axios.put(`http://localhost:3000/orders/${id}`,{"shipmentID":shipmentID,"orderStatus": "success",})
        set.redirect = 'http://localhost:3000/'
        return(update.data)
      }
    } else {
        set.redirect = 'http://localhost:3000/error'
    }
    // return(success);
  }));
  
}
