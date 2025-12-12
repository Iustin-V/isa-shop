import { EvershopRequest } from "@evershop/evershop";
import { pool } from "@evershop/evershop/lib/postgres";
import { getMyCart } from "@evershop/evershop/checkout/services";
import { ExtendedCustomer } from "../../types/extended-customer.js";

export default async function validateSubscription(
  req: EvershopRequest,
  res,
  next,
) {
  try {
    const customer = req.locals.customer as ExtendedCustomer;
    console.log("req.body", req.body);
    const { sku, qty } = req.body;

    const result = await pool.query(
      `SELECT is_subscription, subscription_duration_days
       FROM product
       WHERE sku = $1`,
      [sku],
    );

    const product = result.rows[0];

    if (!product?.is_subscription) {
      return next();
    }
    // RULE 1: Must be logged in
    if (!customer) {
      return res.status(400).json({
        error: {
          message: "You must be logged in to purchase a subscription product.",
        },
      });
    }

    // RULE 2: Only one subscription in cart
    const cartItems = req.locals.sessionID
      ? (
          await getMyCart(req.locals.sessionID, customer.customer_id)
        )?.getItems() || []
      : [];

    const products = await Promise.all(
      cartItems.map((item) => item.getProduct()),
    );

    const cartHasSubscription = products.some(
      (product: any) => product.is_subscription,
    );

    if (cartHasSubscription) {
      return res.status(400).json({
        error: {
          message: "You already have a subscription product in your cart.",
        },
      });
    }

    // RULE 3: Subscription cannot be bought with other products
    if (cartItems.length > 0) {
      return res.status(400).json({
        error: {
          message:
            "Subscription products must be purchased separately. Please complete or empty your cart first.",
        },
      });
    }

    // RULE 4: Check if user already has active subscription
    const expires = customer.subscription_expires_at
      ? new Date(customer.subscription_expires_at)
      : null;

    if (expires && expires > new Date()) {
      return res.status(400).json({
        error: {
          message:
            "You already have an active subscription. You cannot purchase another until it expires.",
        },
      });
    }
    console.log(`Adding subscription to cart for user ${customer.email}`);
    next();
  } catch (err) {
    console.error("Subscription validation failed:", err);
    res
      .status(500)
      .json({ error: { message: "Internal subscription validation error." } });
  }
}
