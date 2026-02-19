const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1").replace(/\/$/, "");
const API_URL = API_BASE.endsWith("/api/v1") ? API_BASE : `${API_BASE}/api/v1`;

async function request(path, { method = "GET", body, token, params } = {}) {
  const query =
    params && Object.keys(params).length
      ? "?" +
        new URLSearchParams(
          Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
        ).toString()
      : "";

  const url = `${API_URL}${path}${query}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/* =========================
   AUTH
========================= */

function pickMobile(payload) {
  if (!payload) return "";
  let m = String(payload.mobile || payload.phone1 || payload.phone || "").trim();
  m = m.replace(/[\s-]/g, "");
  if (m.startsWith("00")) m = `+${m.slice(2)}`;
  return m;
}

export function shopRegister(payload = {}) {
  return request("/app/auth/register", {
    method: "POST",
    body: {
      fullName: String(payload.fullName || "").trim(),
      mobile: pickMobile(payload),
      password: String(payload.password || ""),
    },
  });
}

export function shopLogin(payload = {}) {
  return request("/app/auth/login", {
    method: "POST",
    body: {
      mobile: pickMobile(payload),
      password: String(payload.password || ""),
    },
  });
}

export function shopMe(accessToken) {
  return request("/app/auth/me", { token: accessToken }).then((res) => {
    const user = res?.data || res?.user || res;
    return {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone1: user?.mobile || user?.phone1 || "",
      phone2: user?.phone2 || "",
      city: user?.city || "",
      address: user?.address || "",
      postalCode: user?.postalCode || "",
    };
  });
}

export function shopUpdateMe(payload, token) {
  return request("/app/auth/me", {
    method: "PUT",
    body: payload,
    token,
  }).then((res) => res?.data || res);
}

/* =========================
   ORDERS
========================= */

export function shopListMyOrders(token, params = {}) {
  return request("/app/orders/my", {
    method: "GET",
    token,
    params,
  }).then((res) => {
    const items = res?.data?.items || res?.items || [];
    return {
      items: items.map((o) => ({
        ...o,
        createdAt: o.createdAt || o.created_at,
      })),
    };
  });
}

export function shopCancelOrder(token, orderId) {
  return request(`/app/orders/${orderId}/cancel`, {
    method: "POST",
    token,
  });
}

/* =========================
   TOKEN STORAGE
========================= */

const ACCESS_KEY = "shop_access_token";

export function saveShopTokens(out) {
  const token = out?.token || out?.accessToken || null;
  if (token) localStorage.setItem(ACCESS_KEY, token);
}

export function getShopAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function clearShopTokens() {
  localStorage.removeItem(ACCESS_KEY);
}
