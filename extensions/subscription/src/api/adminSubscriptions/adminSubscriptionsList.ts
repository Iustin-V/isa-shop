import { EvershopRequest } from "@evershop/evershop";
import { pool } from "@evershop/evershop/lib/postgres";

export default async function (req: EvershopRequest, res, next) {
  try {
    const { rows } = await pool.query(
      `
        SELECT *
        FROM subscriptions
        ORDER BY created_at DESC
      `,
    );

    return res.json({ data: rows });
  } catch (err) {
    return res.json({ data: [] });
  }
}
