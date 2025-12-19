import { CurrentCustomer } from "@evershop/evershop";

export type ExtendedCustomer = CurrentCustomer & {
  stripe_customer_id?: string;
};
