import { EvershopRequest } from "@evershop/evershop";
import { getCartByUUID } from "@evershop/evershop/checkout/services";
import { ExtendedCustomer } from "../../types/extended-customer.js";
import { emit } from "@evershop/evershop/lib/event";

export default async function subscriptionGuardCheckout(
  req: EvershopRequest,
  res,
  next,
) {
  const { cart_id } = req.body;
  const customer = req.locals.customer as ExtendedCustomer | undefined;

  if (!cart_id) {
    return next();
  }

  const cart = await getCartByUUID(cart_id);

  if (!cart) {
    return next();
  }

  const items = cart.getItems();

  if (!items.length) {
    return next();
  }

  const products = await Promise.all(items.map((item) => item.getProduct()));

  const hasSubscription = products.some((product) => product.is_subscription);

  if (!hasSubscription) {
    return next();
  }

  if (!customer) {
    return res.status(401).json({
      error: {
        message:
          "You must be logged in to checkout a subscription. Please log in or remove the subscription from your cart.",
      },
    });
  }

  if (!customer.subscription_expires_at) {
    return next();
  }

  const expires = new Date(customer.subscription_expires_at);

  if (expires < new Date()) {
    return next();
  }

  return res.status(409).json({
    error: {
      message:
        "Your account already has an active subscription. Please remove the subscription from your cart.",
    },
  });
}
