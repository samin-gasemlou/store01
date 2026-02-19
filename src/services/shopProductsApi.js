// src/services/shopProductsApi.js

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const API_BASE_PATH = (import.meta.env?.VITE_API_BASE_PATH || "").trim();

const BASE =
  (API_BASE_URL || window.location.origin) +
  (API_BASE_PATH.startsWith("/")
    ? API_BASE_PATH
    : API_BASE_PATH
    ? `/${API_BASE_PATH}`
    : "");

function toQuery(params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const s = String(v);
    if (!s.length) return;
    usp.set(k, s);
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

async function httpGet(path, params) {
  const url = `${BASE}${path}${toQuery(params)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${path} failed: ${res.status} ${text}`);
  }

  return res.json();
}

export function shopListProducts({
  page = 1,
  limit = 50,
  q,
  category,
  brand,
  isActive,
  fields,
} = {}) {
  return httpGet("/products", { page, limit, q, category, brand, isActive, fields });
}

// ✅ Mongo ObjectId validator (24 hex chars)
function isMongoObjectId(x) {
  const s = String(x || "").trim();
  return /^[a-fA-F0-9]{24}$/.test(s);
}

export async function shopGetProduct(id) {
  if (!id) return null;

  // ✅ اگر id لوکال/عددی بود، اصلاً به بک درخواست نزن
  if (!isMongoObjectId(id)) return null;

  return httpGet(`/products/${encodeURIComponent(String(id))}`);
}

export const shopGetProductById = shopGetProduct;
export const getProduct = shopGetProduct;
