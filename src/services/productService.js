import { apiRequest } from "./api.js";

export function fetchProducts() {
  return apiRequest("/products", { method: "GET" });
}

export function fetchProduct(id) {
  return apiRequest(`/products/${id}`, { method: "GET" });
}

export function createProduct(payload) {
  return apiRequest("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProduct(id, payload) {
  return apiRequest(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id) {
  return apiRequest(`/products/${id}`, { method: "DELETE" });
}
