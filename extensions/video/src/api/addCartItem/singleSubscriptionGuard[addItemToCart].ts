import { EvershopRequest } from "@evershop/evershop";
import { pool } from "@evershop/evershop/lib/postgres";
import { getCartByUUID } from "@evershop/evershop/checkout/services";

export default async function exclusiveSubscriptionCartGuard(
  req: EvershopRequest,
  res,
  next,
) {
  const { cart_id } = req.params;
  const { sku } = req.body;

  const productQuery = await pool.query(
    `SELECT is_subscription FROM product WHERE sku = $1`,
    [sku],
  );

  const incomingIsSubscription = productQuery.rows[0]?.is_subscription;

  const cart = await getCartByUUID(cart_id);

  if (!cart) {
    return next();
  }

  const items = cart.getItems();

  if (!items.length) {
    return next();
  }

  const products = await Promise.all(items.map((item) => item.getProduct()));

  const cartHasSubscription = products.some(
    (product) => product.is_subscription,
  );

  const cartHasNonSubscription = products.some(
    (product) => !product.is_subscription,
  );

  if (cartHasSubscription) {
    return res.status(409).json({
      error: {
        message:
          "Your cart already contains a subscription. You cannot add other products.",
      },
    });
  }

  if (incomingIsSubscription && cartHasNonSubscription) {
    return res.status(409).json({
      error: {
        message:
          "Subscriptions must be purchased alone. Please clear your cart first.",
      },
    });
  }

  next();
}
