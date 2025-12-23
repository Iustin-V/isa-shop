import Stripe from "stripe";
import { getConfig } from "@evershop/evershop/lib/util/getConfig";
import { getSetting } from "@evershop/evershop/setting/services";

let stripeInstance;

export async function getStripe() {
  if (stripeInstance) {
    return stripeInstance;
  }

  const stripeConfig: any = getConfig("system.stripe", {});
  let secretKey;

  if (stripeConfig.secretKey) {
    secretKey = stripeConfig.secretKey;
  } else {
    secretKey = await getSetting("stripeSecretKey", "");
  }

  if (!secretKey) {
    throw new Error("Stripe secret key is not configured");
  }

  stripeInstance = new Stripe(secretKey, {
    apiVersion: "2020-08-27",
  });

  return stripeInstance;
}
