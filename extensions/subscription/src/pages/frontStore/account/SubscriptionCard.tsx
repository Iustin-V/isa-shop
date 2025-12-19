import React from "react";
import BillingCard from "@components/BillingCard.js";

export default function SubscriptionCard(props) {
  return <BillingCard mySubscription={props.mySubscription} />;
}
export const layout = {
  areaId: "accountDetails",
  sortOrder: 20,
};
export const query = `
  query AccountPage {
    mySubscription {
      status
      current_period_end
    }
  }
`;
