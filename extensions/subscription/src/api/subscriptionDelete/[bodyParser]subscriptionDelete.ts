import { EvershopRequest } from "@evershop/evershop";
import { pool } from "@evershop/evershop/lib/postgres";

export default async function (req: EvershopRequest, res, next) {
  try {
    const { id } = req.params;

    await pool.query(
      `
        UPDATE subscriptions
        SET
          is_active = false,
          updated_at = NOW()
        WHERE subscription_id = $1
      `,
      [id],
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
