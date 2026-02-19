const RAW_BASE =
  (import.meta?.env?.VITE_API_BASE_URL || "").trim() || "http://localhost:4000";

// ✅ اگر کسی BASE رو با /api/v1 داد، دوباره PREFIX نزن
const BASE_URL = RAW_BASE.replace(/\/+$/, "");
const HAS_API_PREFIX = /\/api\/v1\/?$/i.test(BASE_URL);
const API_PREFIX = HAS_API_PREFIX ? "" : "/api/v1";

function joinUrl(path) {
  const p = String(path || "");
  if (!p.startsWith("/")) return `${BASE_URL}${API_PREFIX}/${p}`;
  return `${BASE_URL}${API_PREFIX}${p}`;
}

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(joinUrl(path), {
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
      (data && (data.message || data.error)) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/* ================= HELPERS ================= */

function normalizePhone(input) {
  let s = String(input || "").trim();
  if (s.startsWith("00")) s = `+${s.slice(2)}`;
  s = s.replace(/\s+/g, "");
  return s;
}

function pickPhone(payload) {
  if (!payload) return "";
  return normalizePhone(payload.mobile || payload.phone1 || payload.phone || "");
}

/* ================= AUTH API ================= */

// ✅ بک شما: fullName + mobile(+phone1) + password
export function shopRegister(payload = {}) {
  const p = pickPhone(payload);
  const body = {
    fullName: String(payload.fullName || "").trim(),
    mobile: p,
    phone1: p, // ✅ backward compatible
    password: String(payload.password || ""),
  };

  return request("/app/auth/register", { method: "POST", body });
}

// ✅ بک شما: mobile(+phone1) + password
export function shopLogin(payload = {}) {
  const p = pickPhone(payload);
  const body = {
    mobile: p,
    phone1: p, // ✅ backward compatible
    password: String(payload.password || ""),
  };

  return request("/app/auth/login", { method: "POST", body });
}

export function shopMe(accessToken) {
  return request("/app/auth/me", {
    method: "GET",
    token: accessToken,
  });
}

/* ================= TOKEN STORAGE ================= */

const ACCESS_KEY = "shop_access_token";
const REFRESH_KEY = "shop_refresh_token"; // فقط برای سازگاری

// ✅ بک: { token, user }  | بعضی جاها ممکنه { accessToken, refreshToken }
export function saveShopTokens(out = {}) {
  const token = out?.token || out?.accessToken || null;
  const refreshToken = out?.refreshToken || null;

  if (token) localStorage.setItem(ACCESS_KEY, token);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function getShopAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function clearShopTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}
