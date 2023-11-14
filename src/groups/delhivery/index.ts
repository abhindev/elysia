import axios from "axios";
import Elysia from "elysia";

type Token = {
  tokendata: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    company_id: number;
    created_at: string;
    token: string;
  };
};

export default function ShiprocketGroups(app: Elysia, prefix: string) {
  return app.group(prefix, (app) =>
    app.get("/track/:id", async ({ params: id }) => {
      const shipmentID = id.id;
      // return shipmentID
      const token = "16f6455f040c286eeb895107e85efd214a2ab632";

      const res = axios
        .get(
            `https://track.delhivery.com/api/v1/packages/json?waybill=${shipmentID}&token=${token}`
        //   `https://staging-express.delhivery.com/api/v1/packages/json/?waybill=${shipmentID}&token=${token}`
        )
        .then((response) => {
          // Handle successful response
          const result = response.data.ShipmentData[0].Shipment.Status.Status;
        //   console.log(result)
          return (result)
        })
        .catch((error) => {
          // Handle error
          console.error(error);
          return (error)
        });
        return (res)
      // if(res){
      //     return(res.data)
      // }else{
      //     return "error"
      // }
    })
  );
}
