import React, { useState } from "react";
import { toast } from "react-toastify";

export default function BillingCard({ mySubscription }) {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    const res = await fetch("/api/subscriptions/portal");
    const json = await res.json();

    if (!res.ok) {
      toast.error(json?.error?.message || "Failed to open billing portal");
      setLoading(false);
      return;
    }

    window.location.href = json.url;
  }

  const hasSubscription = !!mySubscription;

  return (
    <div className="bg-white rounded-lg px-4 py-4 shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Billing</h2>

      {hasSubscription ? (
        <>
          <div className="text-sm text-gray-700">
            <div>
              <strong>Subscription status:</strong> {mySubscription.status}
            </div>

            {mySubscription.current_period_end ? (
              <div className="mt-2">
                <strong>Current period ends:</strong>{" "}
                {new Date(
                  mySubscription.current_period_end,
                ).toLocaleDateString()}
              </div>
            ) : null}
          </div>

          <button
            className="button primary mt-4"
            onClick={openPortal}
            disabled={loading}
          >
            {loading ? "Opening..." : "Manage Billing"}
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-700">
            You do not have an active subscription.
          </p>
          <a className="button primary mt-4" href="/subscriptions">
            View Subscription Plans
          </a>
        </>
      )}
    </div>
  );
}
