import { getStripe } from "./stripe.js";
import { pool } from "@evershop/evershop/lib/postgres";

export async function getOrCreateStripeCustomer(customer) {
  const stripe = await getStripe();

  if (customer.stripe_customer_id) {
    return customer.stripe_customer_id;
  }

  const stripeCustomer = await stripe.customers.create({
    email: customer.email,
    name: customer.full_name,
  });

  await pool.query(
    `
    UPDATE customer
    SET stripe_customer_id = $1
    WHERE customer_id = $2
    `,
    [stripeCustomer.id, customer.customer_id],
  );

  return stripeCustomer.id;
}
