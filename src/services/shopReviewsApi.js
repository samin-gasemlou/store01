const BASE_URL =
  (import.meta?.env?.VITE_API_BASE_URL || "").replace(/\/$/, "") ||
  "http://localhost:4000";

const API_PREFIX = "/api/v1";

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${BASE_URL}${API_PREFIX}${path}`, {
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

// ✅ list reviews
export function shopListProductReviews(productId, { sort = "newest" } = {}) {
  const qs = new URLSearchParams({ sort }).toString();
  return request(`/products/${encodeURIComponent(productId)}/reviews?${qs}`, {
    method: "GET",
  });
}

// ✅ create review (اگر خواستی بدون لاگین هم بشه، تو بک protect رو بردار)
export function shopCreateProductReview(accessToken, productId, payload) {
  return request(`/products/${encodeURIComponent(productId)}/reviews`, {
    method: "POST",
    token: accessToken,
    body: payload,
  });
}

// ✅ react to review
export function shopReactReview(accessToken, reviewId, action) {
  return request(`/reviews/${encodeURIComponent(reviewId)}/react`, {
    method: "POST",
    token: accessToken,
    body: { action }, // "like" | "dislike"
  });
}
