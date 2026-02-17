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
      company: formData.get("company")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      howDidYouHear: formData.get("howDidYouHear")?.toString().trim(),
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
    <div className="container mx-auto px-6  max-w-6xl">
      <div className="text-center">
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
      </div>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="border border-2-gray-200 px-6 py-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 lg:mb-8">
            Get in Touch
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 lg:gap-6"
          >
            <div className="grid grid-cols-1 gap-3 lg:gap-6 lg:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Your name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="company" className="text-sm font-medium">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  required
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Your company's name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 lg:gap-6 lg:grid-cols-2">
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
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  required
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="+44 7700 900000"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="howDidYouHear" className="text-sm font-medium">
                How did you hear about us?
              </label>
              <select
                id="howDidYouHear"
                name="howDidYouHear"
                required
                defaultValue=""
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="" disabled>
                  Please Select
                </option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">Youtube</option>
                <option value="google">Google</option>
                <option value="email">Email</option>
                <option value="referral">Referral / Colleague</option>
                <option value="other">Other</option>
              </select>
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
              className="bg-[#031234] text-white py-4 px-4 rounded font-medium disabled:opacity-50 hover:opacity-90"
            >
              {submitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
        <div className="px-6 ">
          <h1 className="text-2xl font-bold mb-2">Direct Contact</h1>
          <p className="text-gray-400 mb-4">
            For inquiries regarding our surveillance and protection
            publications, training programs, or specialist services, use the
            form below. All communications are handled with professionalism and
            discretion.
          </p>
          <div className="max-w-xl mx-auto ">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 text-gray-600">
                <img
                  src="/phone.svg"
                  alt="phone"
                  height={25}
                  width={25}
                  className="grayscale opacity-70"
                />
                <span className="text-sm font-medium">+40757047733</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <img
                  src="/pin.svg"
                  alt="phone"
                  height={25}
                  width={25}
                  className="grayscale opacity-70"
                />
                <span className="text-sm font-medium">
                  146,R, Studio 210, London EC2A 3AR, United Kingdom
                </span>
              </div>
            </div>
            <div className="mt-8 mb-8 border-t border-gray-200" />
            <div className="rounded-2xl bg-[#031234] p-6 shadow-xl border border-gray-100">
              <img src="/shield.svg" alt="phone" height={25} width={25} />
              <h3 className="text-lg font-semibold text-white mt-4">
                Accredited Training
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Our courses are recognized by international security standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 1,
};
