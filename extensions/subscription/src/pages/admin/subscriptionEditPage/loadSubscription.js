import { setContextValue } from "@evershop/evershop/graphql/services";

export default async (request, response, next) => {
  try {
    const url = request.originalUrl;

    const parts = url.split("/");

    const id = parts[4]; // forth element is the ID/slug

    if (!id) {
      console.error("Error: Could not extract ID from originalUrl", url);
      return next();
    }
    setContextValue(request, "subscriptionId", id);

    next();
  } catch (e) {
    next(e);
  }
};
