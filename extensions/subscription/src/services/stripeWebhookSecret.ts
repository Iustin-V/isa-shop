import { getConfig } from "@evershop/evershop/lib/util/getConfig";
import { getSetting } from "@evershop/evershop/setting/services";

export async function getStripeWebhookSecret() {
  const stripeConfig: any = getConfig("system.stripe", {});
  const secret =
    stripeConfig.endpointSecret ||
    (await getSetting("stripeEndpointSecret", ""));

  if (!secret) {
    throw new Error("Stripe webhook signing secret is not configured");
  }

  return secret;
}
