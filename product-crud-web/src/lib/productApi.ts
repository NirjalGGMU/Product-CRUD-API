import { apiFetch, parseResponse } from "./api";
import { Product, ProductInput } from "@/types";

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await apiFetch("/api/products");
  return parseResponse(res);
};

export const createProduct = async (input: ProductInput) => {
  const res = await apiFetch("/api/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return parseResponse(res);
};

export const updateProduct = async (id: number, input: ProductInput) => {
  const res = await apiFetch(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return parseResponse(res);
};

export const deleteProduct = async (id: number) => {
  const res = await apiFetch(`/api/products/${id}`, { method: "DELETE" });
  if (res.status === 204) return null;
  return parseResponse(res);
};
