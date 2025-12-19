import { EvershopRequest } from "@evershop/evershop";
import { pool } from "@evershop/evershop/lib/postgres";
import { getStripe } from "../../services/stripe.js";

export default async function (req: EvershopRequest, res, next) {
  try {
    const stripe = await getStripe();
    const { id } = req.params;
    const {
      name,
      description,
      interval,
      interval_count,
      price_cents,
      currency,
      is_active,
    } = req.body;
    const { rows } = await pool.query(
      `SELECT * FROM subscriptions WHERE subscription_id = $1`,
      [id],
    );

    if (!rows.length) {
      return res
        .status(404)
        .json({ error: { message: "Subscription not found" } });
    }

    const current = rows[0];
    if (name || description) {
      await stripe.products.update(current.stripe_product_id, {
        name: name ?? current.name,
        description: description ?? current.description,
      });
    }

    let stripePriceId = current.stripe_price_id;

    const billingChanged =
      price_cents !== undefined ||
      interval !== undefined ||
      interval_count !== undefined ||
      currency !== undefined;

    if (billingChanged) {
      const price = await stripe.prices.create({
        unit_amount: price_cents ?? current.price_cents,
        currency: currency ?? current.currency,
        recurring: {
          interval: interval ?? current.interval,
          interval_count: interval_count ?? current.interval_count,
        },
        product: current.stripe_product_id,
      });

      stripePriceId = price.id;
    }

    await pool.query(
      `
        UPDATE subscriptions
        SET
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          interval = COALESCE($3, interval),
          interval_count = COALESCE($4, interval_count),
          price_cents = COALESCE($5, price_cents),
          currency = COALESCE($6, currency),
          stripe_price_id = $7,
          is_active = COALESCE($8, is_active),
          updated_at = NOW()
        WHERE subscription_id = $9
      `,
      [
        name,
        description,
        interval,
        interval_count,
        price_cents,
        currency,
        stripePriceId,
        is_active,
        id,
      ],
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
