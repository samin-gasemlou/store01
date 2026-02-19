// src/services/shopCatalogApi.js

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

export async function fetchPublicCategories({ page = 1, limit = 200, q } = {}) {
  return httpGet("/categories", { page, limit, q });
}

export async function fetchPublicProducts({
  page = 1,
  limit = 6,
  q,
  category,
  brand,
  isActive,
  fields,
} = {}) {
  return httpGet("/products", { page, limit, q, category, brand, isActive, fields });
}

// ✅ جدید: گرفتن محصول با id برای سینک wishlist
export async function fetchPublicProductById(id) {
  if (!id) throw new Error("Product id is required");
  return httpGet(`/products/${encodeURIComponent(String(id))}`);
}

export function slugify(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_/]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function pickProductTitle(p, lang) {
  const l = (lang || "en").split("-")[0];
  if (l === "ar") return p?.name_ar || p?.name_en || p?.name || "";
  if (l === "ku") return p?.name_ku || p?.name_kur || p?.name_en || p?.name || "";
  return p?.name_en || p?.name || p?.name_ar || p?.name_ku || p?.name_kur || "";
}
