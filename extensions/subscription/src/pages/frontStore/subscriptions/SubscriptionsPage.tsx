import React from "react";

function formatMoney(priceCents, currency) {
  const amount = (priceCents / 100).toFixed(2);
  return `${currency.toUpperCase()} ${amount}`;
}

function formatInterval(intervalCount, interval) {
  const unit = intervalCount > 1 ? `${interval}s` : interval;
  return `${intervalCount} ${unit}`;
}

export default function SubscriptionsPage(props) {
  const subscriptions = props.publicSubscriptions || [];
  const mySubscription = props.mySubscription;

  return (
    <div className="page-width p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Subscriptions</h1>

        {mySubscription ? (
          <a href="/account" className="button primary">
            View My Subscription
          </a>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subscriptions.map((plan) => (
          <div
            key={plan.subscription_id}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                {plan.description ? (
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                ) : null}
              </div>

              <div className="text-right">
                <div className="text-lg font-semibold">
                  {formatMoney(plan.price_cents, plan.currency)}
                </div>
                <div className="text-sm text-gray-600">
                  / {formatInterval(plan.interval_count, plan.interval)}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <a
                className="button primary"
                href={`/subscription/${plan.subscription_id}`}
              >
                View Details
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 10,
};

export const query = `
  query SubscriptionsListPage {
    publicSubscriptions {
      subscription_id
      name
      description
      price_cents
      currency
      interval
      interval_count
    }
    mySubscription {
      status
      current_period_end
    }
  }
`;
