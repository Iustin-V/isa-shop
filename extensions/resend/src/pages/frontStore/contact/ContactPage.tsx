import React, { useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus("idle");
    const form = event.currentTarget;
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const fingerprint = result.visitorId;

    const formData = new FormData(form);

    const payload = {
      name: formData.get("name")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      message: formData.get("message")?.toString().trim(),
      fingerprint: fingerprint,
    };

    try {
      const response = await fetch("/api/contact-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data?.success !== true) {
        throw new Error();
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-8">Contact Us</h1>

      {status === "success" && (
        <p className="mb-6 text-green-700 font-medium">
          Thank you for contacting us. We’ll get back to you shortly.
        </p>
      )}

      {status === "error" && (
        <p className="mb-6 text-red-700 font-medium">
          Failed to send message. Please try again.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            placeholder="Your name"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            placeholder="you@example.com"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            placeholder="Write your message here..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#e9d782] text-[#041433] py-2 px-4 rounded font-medium disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
}
export const layout = {
  areaId: "content",
  sortOrder: 1,
};
