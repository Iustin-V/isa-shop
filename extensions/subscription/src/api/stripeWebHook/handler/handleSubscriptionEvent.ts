import { pool } from "@evershop/evershop/lib/postgres";

export async function handleSubscriptionEvent(event) {
  const type = event.type;
  const obj = event.data.object;

  switch (type) {
    case "checkout.session.completed":
      if (obj.mode !== "subscription") {
        return;
      }

      await pool.query(
        `
        UPDATE customer_subscriptions
        SET
          stripe_subscription_id = $1,
          status = 'active'
        WHERE customer_id = $2
          AND subscription_id = $3
          AND stripe_subscription_id IS NULL
        `,
        [
          obj.subscription,
          obj.metadata.customer_id,
          obj.metadata.subscription_id,
        ],
      );
      console.log(
        `Updated subscription for customer with UUID: ${obj.metadata.customer_id}, subscription ID: ${obj.metadata.subscription_id} - Status: ACTIVE`,
      );
      break;

    case "customer.subscription.updated":
      const item = obj.items?.data?.[0];

      await pool.query(
        `
        UPDATE customer_subscriptions
        SET
          status = $1,
          current_period_start = to_timestamp($2),
          current_period_end = to_timestamp($3)
        WHERE stripe_subscription_id = $4
        `,
        [
          obj.status,
          item.current_period_start,
          item.current_period_end,
          obj.id,
        ],
      );
      console.log(
        `Updated subscription Stripe subscription ID: ${obj.id} - Status: ${obj.status}`,
      );
      break;

    case "customer.subscription.deleted":
      await pool.query(
        `
        UPDATE customer_subscriptions
        SET status = 'canceled'
        WHERE stripe_subscription_id = $1
        `,
        [obj.id],
      );
      console.log(
        `Cancelled subscription with stripe subscription ID: ${obj.id} - Status: CANCELED`,
      );
      break;

    case "invoice.payment_failed":
      await pool.query(
        `
        UPDATE customer_subscriptions
        SET status = 'past_due'
        WHERE stripe_subscription_id = $1
        `,
        [obj.subscription],
      );
      console.log(
        `Payment failed fo subscription with stripe subscription ID: ${obj.id} - Status: PAST DUE`,
      );
      break;
  }
}
