// src/api/appClient.js
// A thin fetch wrapper for the *main site* (App users).
// Important: we keep a separate token key so it doesn't conflict with the dashboard/admin token.

const BASE_URL = (import.meta?.env?.VITE_API_BASE_URL || "").replace(/\/$/, "");
const TOKEN_KEY = "app_token";

export function getAppToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setAppToken(token) {
  try {
    if (!token) localStorage.removeItem(TOKEN_KEY);
    else localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

export function buildAssetUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (BASE_URL) return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  return path;
}

export async function appClient(path, { method = "GET", body, auth = false, headers } = {}) {
  const url = `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const h = {
    ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(headers || {}),
  };

  if (auth) {
    const token = getAppToken();
    if (token) h.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers: h,
    body: body instanceof FormData ? body : body != null ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
