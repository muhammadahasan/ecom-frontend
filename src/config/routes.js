export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id = ":id") => `/products/${id}`,
};

