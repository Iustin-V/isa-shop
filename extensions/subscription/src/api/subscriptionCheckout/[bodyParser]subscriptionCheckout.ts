import { EvershopRequest } from "@evershop/evershop";
import { pool } from "@evershop/evershop/lib/postgres";
import { getStripe } from "../../services/stripe.js";
import { getOrCreateStripeCustomer } from "../../services/stripeCustomer.js";

export default async function (req: EvershopRequest, res, next) {
  try {
    const stripe = await getStripe();
    const { subscriptionId } = req.params;

    const customer = req.locals.customer;

    if (!customer) {
      return res
        .status(401)
        .json({
          error: {
            message: "You must be logged in to purchase a subscription",
          },
        });
    }
    const { rows: existing } = await pool.query(
      `
        SELECT 1
        FROM customer_subscriptions
        WHERE customer_id = $1
          AND status IN ('pending', 'active', 'trialing', 'past_due')
        LIMIT 1
      `,
      [customer.uuid],
    );

    if (existing.length) {
      return res.status(409).json({
        error: {
          message: "You already have an active or pending subscription",
        },
      });
    }
    const { rows } = await pool.query(
      `
    SELECT *
    FROM subscriptions
    WHERE subscription_id = $1
      AND is_active = true
    `,
      [subscriptionId],
    );

    if (!rows.length) {
      return res
        .status(404)
        .json({ error: { message: "Subscription not found" } });
    }

    const plan = rows[0];
    const stripeCustomerId = await getOrCreateStripeCustomer(customer);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/subscriptions/success`,
      cancel_url: `${process.env.FRONTEND_URL}/subscriptions`,
      metadata: {
        customer_id: customer.uuid,
        subscription_id: plan.subscription_id,
      },
      subscription_data: {
        metadata: {
          customer_id: customer.uuid,
          subscription_id: plan.subscription_id,
        },
      },
    });
    await pool.query(
      `
    INSERT INTO customer_subscriptions (
      customer_id,
      subscription_id,
      status
    )
    VALUES ($1, $2, 'pending')
    `,
      [customer.uuid, plan.subscription_id],
    );

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
}
