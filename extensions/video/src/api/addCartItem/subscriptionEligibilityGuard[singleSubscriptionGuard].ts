import { EvershopRequest } from "@evershop/evershop";
import { ExtendedCustomer } from "../../types/extended-customer.js";
import { checkSubscriptionEligibility } from "../../services/subscriptionGuardLogic.js";

export default async function subscriptionEligibilityGuard(
  req: EvershopRequest,
  res,
  next,
) {
  const { sku } = req.body;
  const customer = req.locals.customer as ExtendedCustomer | undefined;

  const result = await checkSubscriptionEligibility(sku, customer);

  if (!result.allow) {
    return res.status(result.status).json({
      error: { message: result.message },
    });
  }

  next();
}
