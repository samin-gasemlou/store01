// src/services/shopOrdersApi.js
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://01-app.liara.run").replace(/\/$/, "");
const API_URL = API_BASE.endsWith("/api/v1") ? API_BASE : `${API_BASE}/api/v1`;
const API_PREFIX = "/shop/orders";
const ACCESS_KEY = "shop_access_token";

export function getShopAccessToken() {
  try {
    return localStorage.getItem(ACCESS_KEY);
  } catch {
    return null;
  }
}

export function setShopAccessToken(token) {
  try {
    if (!token) localStorage.removeItem(ACCESS_KEY);
    else localStorage.setItem(ACCESS_KEY, String(token));
  } catch {
    // ignore
  }
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function request(path, { method = "GET", body, token } = {}) {
  const accessToken = token ?? getShopAccessToken();

  const res = await fetch(`${API_URL}${API_PREFIX}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) || `Request failed (${res.status})`;

    const err = new Error(message);
    err.status = res.status;
    err.data = data;

    // اگر توکن مشکل داشت، فرانت بتونه سریع logout کنه
    if (res.status === 401) {
      // فقط پاک می‌کنیم، UI رو دست نمی‌زنیم
      setShopAccessToken(null);
    }

    throw err;
  }

  return data;
}

// ✅ Orders
export function shopCreateOrder(payload) {
  return request("/app/orders", { method: "POST", body: payload });
}

export function shopListMyOrders({ page = 1, limit = 20 } = {}) {
  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  }).toString();

  return request(`/app/orders?${qs}`, { method: "GET" });
}

export function shopGetOrder(orderId) {
  return request(`/app/orders/${orderId}`, { method: "GET" });
}

export function shopCancelOrder(orderId) {
  return request(`/app/orders/${orderId}/cancel`, { method: "POST" });
}

/**
 * ✅ Promo validation (اختیاری)
 * اگر بک route نداره، فعلاً استفاده نکن.
 * POST /app/promocodes/validate body: { code, subtotal }
 */
export function shopValidatePromo({ code, subtotal }) {
  return request("/app/promocodes/validate", {
    method: "POST",
    body: { code: String(code || "").trim(), subtotal: Number(subtotal || 0) },
  });
}
