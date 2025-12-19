import { handleSubscriptionEvent } from "./handler/handleSubscriptionEvent.js";
import { getStripeWebhookSecret } from "../../services/stripeWebhookSecret.js";
import { getStripe } from "../../services/stripe.js";

export default async function stripeSubscriptionGuard(req, res, next) {
  let payload;

  try {
    payload = JSON.parse(req.body?.toString());
  } catch (e) {
    return next();
  }

  const type = payload?.type;
  const object = payload?.data?.object;

  const hasOrderId = object?.metadata?.orderId || object?.metadata?.order_id;

  const isSubscriptionEvent =
    (type === "checkout.session.completed" &&
      object?.mode === "subscription") ||
    type === "customer.subscription.updated" ||
    type === "customer.subscription.deleted" ||
    (type === "invoice.payment_failed" &&
      typeof object?.subscription === "string") ||
    (object?.object === "payment_intent" && !hasOrderId);

  if (!isSubscriptionEvent) {
    return next(); // let EverShop handle orders
  }

  try {
    let event;
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      return res.status(401).send("Unauthorized");
    }

    const stripe = await getStripe();
    const endpointSecret = await getStripeWebhookSecret();

    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    await handleSubscriptionEvent(event);
  } catch (err) {
    console.error("Subscription webhook error:", err);
    return res.status(500).json({ error: "Subscription webhook failed" });
  }

  return res.status(200).json({ received: true });
}
