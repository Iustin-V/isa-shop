import { pool } from "@evershop/evershop/lib/postgres";

export async function hasActiveSubscription(customerId) {
  const { rows } = await pool.query(
    `
    SELECT 1
    FROM customer_subscriptions
    WHERE customer_id = $1
      AND status IN ('active', 'trialing')
      AND current_period_end > NOW()
    LIMIT 1
    `,
    [customerId],
  );

  return rows.length > 0;
}
