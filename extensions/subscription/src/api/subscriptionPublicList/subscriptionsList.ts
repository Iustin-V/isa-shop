import { EvershopRequest } from "@evershop/evershop";
import { pool } from "@evershop/evershop/lib/postgres";

export default async function (req: EvershopRequest, res, next) {
  try {
    const { rows } = await pool.query(
      `
    SELECT
      subscription_id,
      name,
      description,
      interval,
      interval_count,
      price_cents,
      currency
    FROM subscriptions
    WHERE is_active = true
    ORDER BY created_at DESC
    `,
    );

    return res.json({ data: rows });
  } catch (err) {
    return res.json({ data: [] });
  }
}
