import { EvershopRequest } from "@evershop/evershop";
import { pool } from "@evershop/evershop/lib/postgres";
import { getStripe } from "../../services/stripe.js";
import { ExtendedCustomer } from "../../types/ExtendedCustomer.js";

export default async function (req: EvershopRequest, res, next) {
  try {
    const stripe = await getStripe();
    const customer = req.locals.customer as ExtendedCustomer;

    if (!customer) {
      return res.status(401).json({ error: { message: "Unauthorized" } });
    }

    if (!customer.stripe_customer_id) {
      return res
        .status(400)
        .json({ error: { message: "No Stripe customer found" } });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/account`,
    });

    res.json({ url: session.url });
  } catch (err) {
    return res.json({ data: [] });
  }
}
