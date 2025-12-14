import { EvershopRequest } from "@evershop/evershop";
import { assertCartItemQtyIsMutable } from "../../services/subscriptionQtyGuardLogic.js";

export default async function subscriptionQtyGuard(
  req: EvershopRequest,
  res,
  next,
) {
  const { item_id } = req.params;

  const result = await assertCartItemQtyIsMutable(item_id);

  if (!result.allow) {
    return res.status(result.status).json({
      error: { message: result.message },
    });
  }

  return next();
}
