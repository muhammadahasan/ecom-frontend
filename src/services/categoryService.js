import { apiRequest } from "./api.js";

export function fetchCategories() {
  return apiRequest("/categories", { method: "GET" });
}

