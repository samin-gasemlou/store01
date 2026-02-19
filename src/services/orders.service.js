import { api } from "../api/client.js";

export async function createOrder({ items, address, city, promoCode }) {
  return api.post(
    "/orders",
    {
      items,
      address,
      city,
      promoCode: promoCode || "",
    },
    { auth: true }
  );
}

export async function listMyOrders({ page = 1, limit = 20 } = {}) {
  return api.get("/orders", { params: { page, limit }, auth: true });
}

export async function getMyOrder(id) {
  return api.get(`/orders/${id}`, { auth: true });
}
