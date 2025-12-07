import { EvershopRequest } from "@evershop/evershop";
import { getMyCart } from "@evershop/evershop/checkout/services";
import { ExtendedCustomer } from "../../types/extended-customer.js";

export default async function preventSubscriptionQtyChange(
  req: EvershopRequest,
  res,
  next,
) {
  try {
    const customer = req.locals.customer as ExtendedCustomer;
    const itemId = req.params.item_id;
    const cartItems = req.locals.sessionID
      ? (
          await getMyCart(req.locals.sessionID, customer.customer_id)
        )?.getItems() || []
      : [];

    const subscriptionProductItem = cartItems.find((item) => {
      return String(item.getId()) === itemId;
    });
    if (!subscriptionProductItem) {
      return next();
    }

    const product = await subscriptionProductItem.getProduct();
    if (product?.is_subscription) {
      return res.status(400).json({
        error: { message: "Subscription quantity cannot be changed" },
      });
    }
    console.log("THIS SHOULD NOT SHOW");
    next();
  } catch (err) {
    console.error("Subscription qty check failed", err);
    return res.status(500).json({ error: { message: "Server error" } });
  }
}
