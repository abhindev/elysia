import axios from "axios";
import { Order } from "../schema/orderSchema";
import { Product } from "../schema/productSchema";
import { BoxSize } from "../utils/boxSize";

const token = "16f6455f040c286eeb895107e85efd214a2ab632";
const products = await Product.find();
type OrderType = {
  orderId: String;
  name: String;
  add: String;
  pin: String;
  city: String;
  state: String;
  country: String;
  phone: String;
  payment_mode: String;
  products_desc: String;
  hsn_code: String;
  cod_amount: String;
  order_date: String;
  total_amount: String;
  quantity: String;
  shipment_width: String;
  shipment_height: String;
  weight: String;
};
type TESTOrder = {
  user: {
    uid: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    pincode: string;
    city: string;
    state: string;
    landMark: string;
  };
  shipmentID: {
    waybill: string;
    shipmentID: string;
  };
  _id: string; // Assuming you are using a string representation of ObjectID
  items: Array<{
    id: string;
    quantity: number;
    variant: string;
    image: string;
    _id: string; // Assuming you are using a string representation of ObjectID
  }>;
  paymentMethod: string;
  orderStatus: string;
  orderID: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export const Serviceability = async (picode: number | string) => {
  try {
    const response = await fetch(
      `https://track.delhivery.com/c/api/pin-codes/json/?token=${token}&filter_codes=${picode}`
    );
    if (!response.ok) {
      throw new Error(`API fetch failed with status code ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    // Handle the error here
    console.log(error);
    return null;
  }
};

export const Delhivery = async (id: string) => {
  const order: TESTOrder | null = await Order.findOne({ orderID: id });
  if (!order) {
    return {
      error: "order not found",
    };
  }

  const findItem = (id: string | undefined, variant: string | undefined) => {
    const product = products.find((product: any) => product.id === id);
    if (product) {
      const variantInfo = product.variant.find(
        (v: any) => v.variantname === variant
      );
      if (variantInfo) {
        return variantInfo;
      }
    }
    return null;
  };
  const OrderItem =
    order &&
    order.items.map((item) => {
      const { id, variant, quantity }: any = item;
      const items = findItem(id, variant);
      if (items !== null) {
        return {
          name: id,
          sku: items.about?.sku,
          units: quantity,
          selling_price: items.price,
          weight: items.about?.weight,
          variant:variant
        };
      }
    });

  const totalWeight = OrderItem?.reduce((accumulator: number, item: any) => {
    const weight = accumulator + item.weight * item.units;
    const formattedWeight = weight.toFixed(3);
    return parseFloat(formattedWeight); // Convert the formatted weight to a number
  }, 0);

  const totalamount = OrderItem?.reduce((accumulator: number, item: any) => {
    return accumulator + item.selling_price * item.units;
  }, 0);
  const orderProduct = OrderItem?.map(({ weight, ...rest }: any) => rest) ?? [];
  const boxsize = BoxSize(totalWeight || 0.1);
  let productNames:any = [];

  productNames = OrderItem.map((item:any) => {
    return `${item.name} ${item.variant}(${item.units}) `;
  }).join(",");

  const productSkus = OrderItem.map((item:any) => {
    return `${item.sku}`;
  }).join(",");
  const productsquantity = ()=>{
    let quantity =0
    OrderItem.map((item:any) => {
      quantity += item.units;
    });
    return quantity
  }
  const totalquantity = productsquantity()

  const shipment:any = {
    name: order.user.name,
    add: order.user.address,
    pin: order.user.pincode,
    city: order.user.city,
    state: order.user.state,
    // country: order.use,
    phone: order.user.phoneNumber,
    order: order.orderID,
    payment_mode: order.paymentMethod,
    products_desc: productNames,
    hsn_code: productSkus,
    cod_amount: order.paymentMethod == "Prepaid" ? 0 : totalamount+150,
    order_date: order.createdAt,
    total_amount: totalamount,
    quantity: totalquantity,
    shipment_width: boxsize.breadth,
    shipment_height: boxsize.height,
    shipping_mode: "Surface",
  };

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Token ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const raw = `format=json&data={
            "shipments": 
        [${JSON.stringify(shipment)}],
        "pickup_location": {
            "name": "Alakkandi 9th Mile",
            "add": "GROUND FLOOR, VP 19 86/A, VARAMBATTA",
            "city": "Mananthavadi",
            "pin_code": 670731,
            "country": "India",
            "phone": "8075742673"
        }
    }`;
  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  const result: any = await fetch(
    "https://track.delhivery.com/api/cmu/create.json",
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.log("error", error));

  console.log(result.packages[0].waybill);
  const update = await Order.findOneAndUpdate(
    { orderID: id },
    {
      orderStatus: "success",
      "shipmentID": result.packages[0].waybill,
    },
    { new: true }
  );
  console.log(update);
  return result;

  // return shipment;
};
export const Track = async (id:string) => {
  
  try {
    const response = await fetch(
      `https://track.delhivery.com/api/v1/packages/json?waybill=${id}&token=${token}
      `
    );
    if (!response.ok) {
      throw new Error(`API fetch failed with status code ${response.status}`);
    } 
    const result = await response.json();
    const ship = result.ShipmentData;
    return ship[0].Shipment.Status.Status
  } catch (error) {
    // Handle the error here
    console.log(error);
    return null;
  }
};
