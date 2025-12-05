import { CurrentCustomer } from "@evershop/evershop/types/request";

export type ExtendedCustomer = CurrentCustomer & {
  subscription_expires_at: Date | null;
};
