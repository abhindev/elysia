import Elysia from "elysia";

type Token = {tokendata :{
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  company_id: number;
  created_at: string;
  token: string;
}};

export default function ShiprocketGroups(app: Elysia, prefix: string) {
  return app.group(prefix, (app) =>
    app
      .get("/:pincode", async ({ params: pincode }) => {
        const pincodeValue = +pincode["pincode"];

        const tokenData = await fetch(
          "https://apiv2.shiprocket.in/v1/external/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: `vihara.lifecare@gmail.com`,//process.env.EMAIL_SHIPROCKET,
              password: `POP1@spiderman!`,//process.env.PASSWORD_SHIPROCKET,
            }),
          }
        );
        const tokendata:any = await tokenData.json();
        const token = tokendata.token;

        const response = await fetch(
          `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=673575&delivery_postcode=${pincodeValue}&cod=${0}&weight=${0.6}&declared_value=${400}&mode=Surface`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data:any = await response.json();

        if (!data) {
          return { error: "Error" };
        }

        const resData = {
          city: data?.data?.available_courier_companies[0]?.city,
          state: data?.data?.available_courier_companies[0]?.state,
        };

        return resData;
      })
      .get("/track/:id", async ({ params: id }) => {
        const shipmentID = id.id;

        const tokenData = await fetch(
          "https://apiv2.shiprocket.in/v1/external/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: `vihara.lifecare@gmail.com`,
              password: `POP1@spiderman!`,
            }),
          }
        );
        const tokendata:any = await tokenData.json() as Token;
        const token:string = tokendata.token;

        const response = await fetch(
          `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data:any = await response.json();

        if (!data) {
          return { error: "Error" };
        }
        if (data?.tracking_data.shipment_track) {
          const currentStatus =
            data.tracking_data.shipment_track[0].current_status;
          const track_url = data.tracking_data.track_url;
          const edd = data?.tracking_data.etd;
          return { currentStatus, track_url, edd };
        } else {
          return data;
        }
      })
  );
}
