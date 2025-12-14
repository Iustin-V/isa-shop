import { EvershopRequest } from "@evershop/evershop";
import { getMyCart } from "@evershop/evershop/checkout/services";

export default async function addNoShippingMethod(
  req: EvershopRequest,
  res,
  next,
) {
  const customer = req.locals.customer;
  if (customer) {
    const methodName = req.body.method_name;
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

    if (methodName === "No Shipping") {
      if (cartHasSubscription) {
        return next();
      } else {
        return res.status(400).json({
          error: {
            message:
              "Only subscription products can be purchased without shipping.",
          },
        });
      }
    } else {
      if (cartHasSubscription) {
        return res.status(400).json({
          error: {
            message: "Shipping can not be applied to subscription products.",
          },
        });
      }
    }
  }

  next();
}
