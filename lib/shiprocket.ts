import { Order } from "../schema/orderSchema";
import { Product } from "../schema/productSchema";
import { getCurrentDateTime } from "../utils/getCurrentDateTime";
import { BoxSize } from "../utils/boxSize";

const products = await Product.find();

export const shiprocket = async (orderID: string) => {
  const order = await Order.findOne({ orderID });
  const CurrentDateTime = getCurrentDateTime();
  const tokenData = await fetch(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: 'vihara.lifecare@gmail.com',
        password: 'POP1@spiderman!',
      }),
    }
  );
  const tokendata:any = await tokenData.json();
  const token = tokendata.token;
  
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
  
    return null; // Return null if item not found
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

  const row = JSON.stringify({
    order_id: order?.orderID,
    order_date: CurrentDateTime,
    pickup_location: "Vihara",
    billing_customer_name: order?.user?.name,
    billing_last_name: "",
    billing_address: order?.user?.address,
    billing_city: order?.user?.city,
    billing_pincode: order?.user?.pincode,
    billing_state: order?.user?.state,
    billing_country: "India",
    billing_email: order?.user?.email,
    billing_phone: order?.user?.phoneNumber,
    shipping_is_billing: true,

    order_items: orderProduct,
    payment_method: order?.paymentMethod,

    sub_total:
      order?.paymentMethod === "COD"
        ? (totalamount ?? 0) + 150
        : totalamount ?? 0,
    length: boxsize.length,
    breadth: boxsize.breadth,
    height: boxsize.height,
    weight: totalWeight,
  });

  const response = await fetch(
    `https://apiv2.shiprocket.in/v1/external/orders/create/adhoc`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: row,
    }
  );

  const result = await response.json()

  console.log(result)

  return result;
};


