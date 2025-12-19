import { EvershopRequest } from "@evershop/evershop";
import { pool } from "@evershop/evershop/lib/postgres";
import { getStripe } from "../../services/stripe.js";

export default async function (req: EvershopRequest, res, next) {
  try {
    const stripe = await getStripe();
    const {
      name,
      description,
      interval,
      interval_count = 1,
      price_cents,
      currency = "gbp",
    } = req.body;
    const product = await stripe.products.create({
      name,
      description,
    });

    const price = await stripe.prices.create({
      unit_amount: price_cents,
      currency,
      recurring: {
        interval,
        interval_count,
      },
      product: product.id,
    });
    const { rows } = await pool.query(
      `
    INSERT INTO subscriptions (
      name,
      description,
      interval,
      interval_count,
      price_cents,
      currency,
      stripe_product_id,
      stripe_price_id,
      is_active
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true)
    RETURNING subscription_id
    `,
      [
        name,
        description,
        interval,
        interval_count,
        price_cents,
        currency,
        product.id,
        price.id,
      ],
    );

    res.json({
      success: true,
      subscription_id: rows[0].subscription_id,
    });
  } catch (err) {
    next(err);
  }
}
