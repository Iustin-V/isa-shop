import { pool } from "@evershop/evershop/lib/postgres";
import { ExtendedCustomer } from "../types/extended-customer.js";
import { GuardResult } from "../types/guard-result.js";

export async function checkSubscriptionEligibility(
  sku: string,
  customer?: ExtendedCustomer,
): Promise<GuardResult> {
  const productQuery = await pool.query(
    `SELECT is_subscription FROM product WHERE sku = $1`,
    [sku],
  );

  const isSubscription = productQuery.rows[0]?.is_subscription;

  if (!isSubscription) {
    return { allow: true };
  }

  if (!customer) {
    return {
      allow: false,
      status: 401,
      message: "Authentication required",
    };
  }

  if (!customer.subscription_expires_at) {
    return { allow: true };
  }

  const expires = new Date(customer.subscription_expires_at);
  const now = new Date();

  if (expires < now) {
    return { allow: true };
  }

  return {
    allow: false,
    status: 409,
    message: "Your account already has an active subscription.",
  };
}
