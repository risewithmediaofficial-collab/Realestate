import { lazy } from "react";

export const lazyRoute = (loader) => {
  const Component = lazy(loader);
  Component.preload = loader;
  return Component;
};

export const preloadLazyRoutes = async (routes = []) =>
  Promise.allSettled(routes.map((route) => (typeof route === "function" ? route() : null)));
