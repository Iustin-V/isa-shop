import React from "react";

export default function CustomerSubscriptions({ customerSubscriptions }) {
  return (
    <div className="admin-content p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Customer Subscriptions</h1>
      </div>

      <div className="card shadow">
        <table className="listing sticky">
          <thead>
            <tr>
              <th className="column">
                <div className="font-medium uppercase text-xs">
                  Customer Email
                </div>
              </th>
              <th className="column">
                <div className="font-medium uppercase text-xs">
                  Subscription
                </div>
              </th>{" "}
              <th className="column">
                <div className="font-medium uppercase text-xs">Status</div>
              </th>
              <th className="column">
                <div className="font-medium uppercase text-xs">Period</div>
              </th>
              <th className="column">
                <div className="font-medium uppercase text-xs">Stripe</div>
              </th>
              <th className="column">
                <div className="font-medium uppercase text-xs">Created</div>
              </th>
            </tr>
          </thead>

          <tbody>
            {customerSubscriptions?.map((sub) => (
              <tr key={sub.customer_subscription_id}>
                <td className="font-semibold">{sub.email}</td>
                <td>
                  <div className="font-semibold">{sub.subscription_name}</div>
                  <div className="text-xs text-gray-500">
                    {(sub.price_cents / 100).toFixed(2)}{" "}
                    {sub.currency.toUpperCase()} / {sub.interval_count}{" "}
                    {sub.interval}
                    {sub.interval_count > 1 ? "s" : ""}
                  </div>
                </td>

                <td>{sub.status}</td>

                <td>
                  {new Date(
                    Number(sub.current_period_start),
                  ).toLocaleDateString()}{" "}
                  –{" "}
                  {new Date(
                    Number(sub.current_period_end),
                  ).toLocaleDateString()}
                </td>

                <td>
                  <a
                    href={`https://dashboard.stripe.com/subscriptions/${sub.stripe_subscription_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                </td>

                <td>{new Date(Number(sub.created_at)).toUTCString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 10,
};

export const query = `
  query CustomerSubscriptions {
    customerSubscriptions {
      subscription_name
      price_cents
      currency
      interval
      interval_count
      customer_subscription_id
      email
      full_name
      customer_id
      stripe_subscription_id
      status
      current_period_start
      current_period_end
      created_at
    }
  }
`;
