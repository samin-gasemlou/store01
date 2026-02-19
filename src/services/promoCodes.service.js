import { api } from "../api/client.js";

export async function validatePromo({ code, subtotal }) {
  return api.post("/promocodes/validate", {
    code,
    subtotal: Number(subtotal || 0),
  });
}
