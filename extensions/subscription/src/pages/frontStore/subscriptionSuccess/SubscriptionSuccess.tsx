import React from "react";

export default function SubscriptionSuccess() {
  return (
    <div className="max-w-xl mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-semibold mb-4">Subscription activated</h1>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your subscription is now active. You can
        start using all premium features immediately.
      </p>
      <div className="flex flex-col gap-3">
        <a href="/account" className="button primary">
          Go to my account
        </a>
        <a href="/videos" className="button outline">
          Online Courses
        </a>
      </div>
      <p className="text-sm text-gray-500 mt-8">
        A receipt has been sent to your email.
      </p>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 1,
};
