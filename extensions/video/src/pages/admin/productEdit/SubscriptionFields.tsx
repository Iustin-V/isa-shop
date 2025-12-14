import React from "react";
import { InputField } from "@components/common/form/InputField.js";

export default function SubscriptionFields(props) {
  const [isSubscriptionProduct, setIsSubscriptionProduct] = React.useState(
    props.product.isSubscription || false,
  );
  return (
    <div className="bg-white rounded shadow p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Subscription Settings</h2>
      <p className="text-gray-600 text-sm mb-4">
        This product will grant customers access to the video section for the
        specified subscription duration. Subscription products can only be
        purchased by logged-in customers with an active account.
      </p>
      <InputField
        name="is_subscription"
        type="checkbox"
        checked={isSubscriptionProduct}
        onChange={(e) => setIsSubscriptionProduct(e.target.checked)}
        label="Is Subscription Product?"
      />
      {isSubscriptionProduct && (
        <InputField
          name="subscription_duration_days"
          defaultValue={props.product.subscriptionDurationDays}
          type="number"
          label="Subscription Duration (days)"
        />
      )}
    </div>
  );
}
export const layout = {
  areaId: "productEditGeneral",
  sortOrder: 60,
};

export const query = `
  query SubscriptionFieldsQuery ($id: ID!) {
    product(id: getContextValue("productId")) {
      productId
      isSubscription
      subscriptionDurationDays
    }
  }
`;
