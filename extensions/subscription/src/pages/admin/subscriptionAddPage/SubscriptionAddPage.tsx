import React, { useState } from "react";
import { toast } from "react-toastify";

export default function SubscriptionAddPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    interval: "month",
    interval_count: 1,
    is_active: true,
  });

  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/admin/subscription/new", {
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
    });

    if (res.ok) {
      window.location.href = "/admin/all-subscriptions";
    } else {
      toast.error("Failed to create subscription");
    }

    setSaving(false);
  }

  return (
    <div className="admin-content p-8 max-w-3xl">
      <h1 className="text-3xl font-semibold mb-6">Create Subscription</h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block font-medium mb-1">Name *</label>
            <input
              name="name"
              className="border rounded p-2 w-full"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              className="border rounded p-2 w-full"
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
                className="border rounded p-2 w-full"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Interval</label>
              <select
                name="interval"
                className="border rounded p-2 w-full"
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
                className="border rounded p-2 w-full"
                value={form.interval_count}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Active</label>
            <select
              value={form.is_active ? "true" : "false"}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.value === "true" })
              }
              className="border rounded p-2 w-full"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        </div>

        <div className="form-submit-button flex border-t mt-4 pt-4 justify-end">
          <button className="button primary" disabled={saving}>
            {saving ? "Saving..." : "Save Subscription"}
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
