import React, { useState } from "react";
import { toast } from "react-toastify";

export default function SubscriptionEditPage(props) {
  const subscription = props.subscription;

  const [form, setForm] = useState({
    name: subscription.name,
    description: subscription.description || "",
    price: (subscription.price_cents / 100).toFixed(2),
    interval: subscription.interval,
    interval_count: subscription.interval_count,
    is_active: subscription.is_active,
  });

  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(
      `/api/admin/subscription/update/${subscription.subscription_id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price_cents: Math.round(Number(form.price) * 100),
          interval: form.interval,
          interval_count: Number(form.interval_count),
          is_active: form.is_active,
        }),
      },
    );

    if (res.ok) {
      window.location.href = "/admin/all-subscriptions";
    } else {
      toast.error("Failed to update subscription");
    }

    setSaving(false);
  }

  async function handleDisable() {
    if (!confirm("Are you sure you want to disable this subscription?")) {
      return;
    }

    const res = await fetch(
      `/api/admin/subscription/delete/${subscription.subscription_id}`,
      {
        method: "DELETE",
      },
    );

    if (res.ok) {
      window.location.href = "/admin/all-subscriptions";
    } else {
      toast.error("Failed to disable subscription");
    }
  }

  return (
    <div className="admin-content p-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Edit Subscription</h1>
        <button type="button" className="button danger" onClick={handleDisable}>
          Disable
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block font-medium mb-1">Name *</label>
            <input
              name="name"
              className="border border-[#d1d5db] rounded p-2 w-full"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              className="border border-[#d1d5db] rounded p-2 w-full"
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">Price</label>
              <input
                name="price"
                type="number"
                step="0.01"
                className="border border-[#d1d5db] rounded p-2 w-full"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Interval</label>
              <select
                name="interval"
                className="border border-[#d1d5db] rounded p-2 w-full"
                value={form.interval}
                onChange={handleChange}
              >
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Interval Count</label>
              <input
                name="interval_count"
                type="number"
                min={1}
                className="border border-[#d1d5db] rounded p-2 w-full"
                value={form.interval_count}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Active</label>
            <select
              className="border border-[#d1d5db] rounded p-2 w-full"
              value={form.is_active ? "true" : "false"}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.value === "true" })
              }
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Stripe (read-only)
            </h3>

            <p className="text-sm">
              <strong>Product ID:</strong>{" "}
              <code>{subscription.stripe_product_id}</code>
            </p>

            <p className="text-sm">
              <strong>Price ID:</strong>{" "}
              <code>{subscription.stripe_price_id}</code>
            </p>

            <p className="text-xs text-gray-500 mt-2">
              Changing price or interval creates a new Stripe Price
              automatically.
            </p>
          </div>
        </div>

        <div className="form-submit-button flex border-t mt-4 pt-4 justify-between">
          <a href="/admin/all-subscriptions" className="button danger outline">
            Cancel
          </a>

          <button type="submit" className="button primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 10,
};

export const query = `
  query SubscriptionEditQuery {
    subscription(
      id: getContextValue("subscriptionId")
    ) {
      subscription_id
      name
      description
      price_cents
      interval
      interval_count
      is_active
      stripe_product_id
      stripe_price_id
    }
  }
`;
