import React from "react";

export default function SubscriptionCard(props) {
  const customer = props.currentCustomer;

  const expires = new Date(Number(customer.subscriptionExpiresAt));
  const isExpired = expires < new Date();

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <strong>Subscription status:</strong>
      {customer.subscriptionExpiresAt ? (
        <div>
          {isExpired ? (
            <span className="text-red-600">
              Expired on {expires.toLocaleDateString()}
            </span>
          ) : (
            <span className="text-green-600">
              Active until {expires.toLocaleDateString()}
            </span>
          )}
        </div>
      ) : (
        <div>
          <span className="text-red-600">No subscription found.</span>
        </div>
      )}
    </div>
  );
}
export const layout = {
  areaId: "accountDetails",
  sortOrder: 20,
};
export const query = `
  query CustomerQuery {
     currentCustomer {
      id
      subscriptionExpiresAt
  }
  }
`;
