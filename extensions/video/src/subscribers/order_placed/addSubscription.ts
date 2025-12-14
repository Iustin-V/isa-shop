import { pool } from "@evershop/evershop/lib/postgres";
import { error } from "@evershop/evershop/lib/log";

const addSubscription = async (data) => {
  const { order_id, payment_status } = data;

  if (payment_status !== "paid") {
    console.error(`Order not paid. Skipping subscription check`);
    return;
  }
  try {
    const orderRes = await pool.query(
      `SELECT *
       FROM "order"
       WHERE order_id = $1`,
      [order_id],
    );
    const order = orderRes.rows[0];

    if (!order) {
      console.error(`Could not find order with ID: ${order_id}`);
      return;
    }

    const customerId = order.order_customer_id;

    const itemsRes = await pool.query(
      `
        SELECT oi.*, p.is_subscription, p.subscription_duration_days
        FROM order_item oi
               JOIN product p ON p.product_id = oi.product_id
        WHERE oi.order_item_order_id = $1
      `,
      [order_id],
    );

    const subscriptionItem = itemsRes.rows.find(
      (row) => row.is_subscription === true,
    );

    if (!subscriptionItem) {
      return;
    }

    const duration = subscriptionItem.subscription_duration_days || 30;

    const expires = new Date();
    expires.setDate(expires.getDate() + duration);

    await pool.query(
      `
        UPDATE customer
        SET subscription_expires_at = $1
        WHERE customer_id = $2
      `,
      [expires, customerId],
    );

    console.log(
      `[Subscription] Added subscription to customer ${customerId} until ${expires}`,
    );
  } catch (e) {
    console.error(`Failed to evaluate order ${order_id}: ${e}`);
  }
};

export default addSubscription;
