import { Product } from "../schema/productSchema";
import crypto from "crypto";

const products = await Product.find();

// types
type phonePe = {
  merchantTransactionId: string | undefined;
  merchantUserId: string | undefined;
  amount: number | undefined;
  mobileNumber: string | undefined;
};

const salt = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"
const index = "1";
const merchantId = "PGTESTPAYUAT";

//FIND PRICE WITH  ORDERED PRODUCT ID AND VARIANT
// *user order only have array of productid ,variant ,quantity

const findPrice = (id: string | undefined, variant: string | undefined) => {
  const product = products.find((product: any) => product.id === id);
  if (product) {
    const variantInfo = product.variant.find(
      (v: any) => v.variantname === variant
    );
    if (variantInfo) {
      return variantInfo.price;
    }
  }
  return null; // Return null if item not found
};

// REQUEST TO PHONEPE TO GET REDIREACT URL

const getPhonePe = async ({
  merchantTransactionId,
  merchantUserId,
  amount,
  mobileNumber,
}: phonePe) => {
  const payload = {
    merchantId: merchantId,
    merchantTransactionId: merchantTransactionId,
    merchantUserId: merchantUserId,
    amount: amount,
    redirectUrl: `http://localhost:3001/orders/success/${merchantTransactionId}`, //https://www.kalyaniammas.com/cart/checkout/success/${body.merchantTransactionId}
    redirectMode: "POST",
    callbackUrl: `https://www.kalyaniammas.com/cart/checkout/error`,
    mobileNumber: mobileNumber,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };
  const base64Payload = btoa(JSON.stringify(payload));
  const sha256 = crypto
    .createHash("sha256")
    .update(`${base64Payload}/pg/v1/pay${salt}`)
    .digest("hex");
  const verify = `${sha256}###${index}`;

  try {
    const response = await fetch(`${process.env.PHONEPE_URL}/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": verify,
        accept: "application/json",
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    });

    if (!response.ok) {
        console.log(response)
      // throw new Error(`HTTP error! Status: ${response}`);
    }

    const data = await response.json();
    return data;
    // Process the data as needed
  } catch (error) {
    // Handle the error here
    console.error("An error occurred:", error);
    // You can also set an error state to display an error message to the user
  }
};

export const PhonePe = async ({ order }: any) => {
  const itemPrices = order.items.map((item: any) => {
    const { id, variant, quantity }: any = item;
    const price = findPrice(id, variant);
    if (price !== null) {
      return {
        id,
        variant,
        quantity,
        price,
        total: price * quantity, // Calculate total price for the item
      };
    } else {
      return {
        id,
        variant,
        quantity,
        price: "Item not found", // Handle item not found
        total: 0, // Set total to 0 for item not found
      };
    }
  });

  const totalamount = itemPrices.reduce((accumulator: number, item: any) => {
    return accumulator + item.total;
  }, 0); // Initialize accumulator with 0

  const data:any = await getPhonePe({
    merchantTransactionId: order.orderID,
    merchantUserId: order?.user?.uid,
    amount: totalamount * 100,
    mobileNumber: order?.user?.phoneNumber,
  });
  console.log(data.data);
  const redirectUrl = data.data.instrumentResponse.redirectInfo.url;
  return redirectUrl;
};

export const getPhonePeStatus = async (transactionId: string) => {
  const merchantTransactionId = transactionId;

  console.log(merchantTransactionId);

  const sha256 = crypto
    .createHash("sha256")
    .update(`/pg/v1/status/${merchantId}/${merchantTransactionId}${salt}`)
    .digest("hex");
  const verify = `${sha256}###${index}`;

  try {
    const response = await fetch(
      `${process.env.PHONEPE_URL}/status/${merchantId}/${merchantTransactionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": verify,
          "X-MERCHANT-ID": merchantId,
        },
      }
    );
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log(`Error fetching transaction status ${error}`);
    return null;
  }
};
