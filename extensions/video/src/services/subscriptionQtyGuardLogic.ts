import { pool } from "@evershop/evershop/lib/postgres";
import { GuardResult } from "../types/guard-result.js";

export async function assertCartItemQtyIsMutable(
  item_id: string,
): Promise<GuardResult> {
  const productQuery = await pool.query(
    `SELECT p.is_subscription
     FROM cart_item ci
            JOIN product p ON p.product_id = ci.product_id
     WHERE ci.uuid = $1`,
    [item_id],
  );

  const isSubscription = productQuery.rows[0]?.is_subscription;

  if (isSubscription) {
    return {
      allow: false,
      status: 409,
      message: "Subscription quantity can not be modified",
    };
  }
  return { allow: true };
}
