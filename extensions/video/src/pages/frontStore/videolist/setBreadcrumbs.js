import {
  getContextValue,
  setContextValue,
} from "@evershop/evershop/graphql/services";

export default (req, res, next) => {
  getContextValue(req, "videoSlug");

  setContextValue(req, "pageInfo", {
    title: "Videos",
    breadcrumbs: [
      {
        name: "Home",
        url: "/",
      },
      {
        name: "Videos",
        url: "/video",
      },
    ],
  });

  next();
};
