import React, { useState } from "react";
import { toast } from "react-toastify";

function formatMoney(priceCents, currency) {
  const amount = (priceCents / 100).toFixed(2);
  return `${currency.toUpperCase()} ${amount}`;
}

function formatInterval(intervalCount, interval) {
  const unit = intervalCount > 1 ? `${interval}s` : interval;
  return `${intervalCount} ${unit}`;
}

export default function SubscriptionDetailsPage(props) {
  const plan = props.publicSubscription;
  const mySubscription = props.mySubscription;
  const [loading, setLoading] = useState(false);

  if (!plan) {
    return (
      <div className="page-width p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold">Subscription not found</h1>
      </div>
    );
  }

  const hasSubscription =
    !!mySubscription &&
    (mySubscription.status === "active" ||
      mySubscription.status === "trialing" ||
      mySubscription.status === "past_due");

  const isThisTheirSub =
    hasSubscription && mySubscription.subscription_id === plan.subscription_id;

  async function handlePurchase() {
    setLoading(true);
    const res = await fetch(
      `/api/subscriptions/${plan.subscription_id}/checkout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    );
    const json = await res.json();

    if (!res.ok) {
      setLoading(false);
      toast.error(json?.error?.message || "Failed to start checkout");
      return;
    }

    window.location.href = json.url;
  }

  async function handleManageBilling() {
    setLoading(true);
    const res = await fetch("/api/subscriptions/portal");
    const json = await res.json();

    if (!res.ok) {
      setLoading(false);
      toast.error(json?.error?.message || "Failed to open billing portal");
      return;
    }

    window.location.href = json.url;
  }

  return (
    <div className="page-width p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-semibold">{plan.name}</h1>

        {plan.description ? (
          <p className="text-gray-700 mt-3">{plan.description}</p>
        ) : null}

        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className="text-2xl font-semibold">
              {formatMoney(plan.price_cents, plan.currency)}
            </div>
            <div className="text-gray-600">
              Billed every {formatInterval(plan.interval_count, plan.interval)}
            </div>
          </div>

          {hasSubscription ? (
            isThisTheirSub ? (
              <button
                className="button primary"
                onClick={handleManageBilling}
                disabled={loading}
              >
                {loading ? "Opening..." : "Manage Billing"}
              </button>
            ) : (
              <div className="mt-4 p-4 bg-gray-100 rounded text-sm text-gray-700">
                <p className="font-medium mb-1">
                  You already have an active subscription.
                </p>
                <p>
                  To switch plans, please cancel your current subscription and
                  wait until it expires on{" "}
                  <strong>
                    {new Date(
                      mySubscription.current_period_end,
                    ).toLocaleDateString()}
                  </strong>
                  .
                </p>
              </div>
            )
          ) : (
            <button
              className="button primary"
              onClick={handlePurchase}
              disabled={loading}
            >
              {loading ? "Redirecting..." : "Subscribe"}
            </button>
          )}
        </div>

        {mySubscription?.current_period_end ? (
          <div className="mt-4 text-sm text-gray-600">
            Current period ends on{" "}
            {new Date(mySubscription.current_period_end).toLocaleDateString()}
          </div>
        ) : null}

        <div className="mt-6">
          <a href="/subscriptions" className="button outline">
            Back to Subscriptions
          </a>
        </div>
      </div>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 10,
};

export const query = `
  query SubscriptionDetailsPage {
    publicSubscription(id: getContextValue("subscriptionId")) {
      subscription_id
      name
      description
      price_cents
      currency
      interval
      interval_count
    }
    mySubscription {
      subscription_id
      status
      current_period_end
    }
  }
`;
