import React from "react";

export default function SubscriptionGrid({ subscriptions }) {
  return (
    <div className="admin-content p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Subscriptions</h1>
        <a href="/admin/subscription/new" className="button primary">
          Add Subscription
        </a>
      </div>
      <div className="card shadow">
        <table className="listing sticky">
          <thead>
            <tr>
              <th className="column">
                <div className="font-medium uppercase text-xs">Name</div>
              </th>
              <th className="column">
                <div className="font-medium uppercase text-xs">Description</div>
              </th>
              <th className="column">
                <div className="font-medium uppercase text-xs">Price</div>
              </th>
              <th className="column">
                <div className="font-medium uppercase text-xs">Interval</div>
              </th>
              <th className="column">
                <div className="font-medium uppercase text-xs">Status</div>
              </th>
              <th className="column"></th>
            </tr>
          </thead>

          <tbody>
            {subscriptions?.map((sub) => (
              <tr key={sub.subscription_id}>
                <td>
                  <a
                    href={`/admin/subscription/edit/${sub.subscription_id}`}
                    className="hover:underline font-semibold"
                  >
                    {sub.name}
                  </a>
                </td>
                <td>{sub.description}</td>
                <td>${(sub.price_cents / 100).toFixed(2)}</td>
                <td>
                  {sub.interval_count} {sub.interval}
                  {sub.interval_count > 1 ? "s" : ""}
                </td>
                <td>{sub.is_active ? "Active" : "Inactive"}</td>
                <td>
                  <a
                    href={`/admin/subscription/edit/${sub.subscription_id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </a>
                </td>
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
  query SubscriptionQuery {
    subscriptions {
      subscription_id
      name
      description
      price_cents
      interval
      interval_count
      is_active
    }
  }
`;
