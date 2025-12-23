import { setContextValue } from "@evershop/evershop/graphql/services";

export default async (request, response, next) => {
  try {
    const url = request.originalUrl;

    const parts = url.split("/");

    const slug = parts[2]; // third element is the ID/slug
    if (!slug) {
      console.error("Error: Could not extract ID from originalUrl", url);
      return next();
    }
    setContextValue(request, "videoSlug", slug);

    next();
  } catch (e) {
    next(e);
  }
};
