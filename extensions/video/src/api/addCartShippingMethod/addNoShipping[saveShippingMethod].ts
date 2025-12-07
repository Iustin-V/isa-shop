import { EvershopRequest } from "@evershop/evershop";

export default async function addNoShippingMethod(
  req: EvershopRequest,
  res,
  next,
) {
  // const cart = req.locals.cart;
  //
  // if (!cart) {
  //   return next();
  // }

  // Get existing shipping methods computed by EverShop
  const existing = req.locals.delegates.get("shipping_method") || [];
  console.log("existing", existing);
  // Inject custom "no_shipping" method
  const custom = {
    id: "no_shipping",
    code: "no_shipping",
    name: "No Shipping Required",
    cost: {
      amount: 0,
      currency: "USD", // or pull from config
    },
  };

  // Push new option into the array
  req.locals.delegates.setOnce("shipping_method", [...existing, custom]);

  next();
}
