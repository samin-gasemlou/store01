import { api, buildAssetUrl } from "../api/client.js";

function normalizeProduct(p) {
  if (!p) return null;

  const id = String(p._id || p.id || "");
  const title = p.name_en || p.name || "—";
  const price = Number(p.price || 0);
  const img = p.mainImage ? buildAssetUrl(p.mainImage) : "/placeholder.jpg";

  return {
    id,
    title,
    img,
    price,
    category: p.categoryName || "",
    subCategory: p.subCategoryName || "",
    brand: p.brandName || "",
    description: p.description_en || p.description_ar || p.description_kur || "",
    raw: p,
  };
}

export async function listProducts({ page = 1, limit = 50, q, category, subCategory, brand } = {}) {
  const res = await api.get("/products", {
    params: {
      page,
      limit,
      q: q || "",
      category: category || "",
      subCategory: subCategory || "",
      brand: brand || "",
    },
  });

  const rows = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
  return {
    total: res?.total ?? rows.length,
    page: res?.page ?? page,
    limit: res?.limit ?? limit,
    items: rows.map(normalizeProduct).filter(Boolean),
  };
}

export async function getProduct(id) {
  const res = await api.get(`/products/${id}`);
  return normalizeProduct(res);
}
