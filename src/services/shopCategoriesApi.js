// src/services/shopCategoriesApi.js
import client from "../api/client";
import { toSlug } from "../utils/slug";

const CANDIDATE_CATEGORIES_ENDPOINTS = [
  "/categories",
  "/category",
];

const CANDIDATE_SUBCATEGORIES_ENDPOINTS = [
  "/subCategories",
  "/subcategories",
  "/sub-categories",
  "/subCategory",
];

function pickLocalized(obj, lang) {
  // مطابق بک شما: kur/ar/en
  if (!obj) return "";
  const l = (lang || "en").toLowerCase();

  // بعضی بک‌ها name_kur دارند بعضی name_ku، هر دو رو ساپورت می‌کنیم
  const kur =
    obj.name_kur ?? obj.name_ku ?? obj.title_kur ?? obj.title_ku ?? obj.kur ?? "";
  const ar =
    obj.name_ar ?? obj.title_ar ?? obj.ar ?? "";
  const en =
    obj.name_en ?? obj.title_en ?? obj.en ?? obj.name ?? obj.title ?? "";

  if (l === "ar") return String(ar || en || kur || "");
  if (l === "ku" || l === "kur") return String(kur || en || ar || "");
  return String(en || ar || kur || "");
}

function normalizeArray(payload) {
  // axios => res.data
  const raw =
    (Array.isArray(payload) ? payload : null) ||
    (Array.isArray(payload?.data) ? payload.data : null) ||
    (Array.isArray(payload?.items) ? payload.items : null) ||
    (Array.isArray(payload?.categories) ? payload.categories : null) ||
    (Array.isArray(payload?.subCategories) ? payload.subCategories : null) ||
    (Array.isArray(payload?.subcategories) ? payload.subcategories : null) ||
    [];

  return raw.filter(Boolean);
}

async function tryGetFirstWorking(pathCandidates, params) {
  let lastErr = null;

  for (const path of pathCandidates) {
    try {
      const res = await client.get(path, { params });
      return res?.data;
    } catch (e) {
      lastErr = e;
    }
  }

  const msg =
    lastErr?.response?.data?.message ||
    lastErr?.message ||
    "Failed to load";
  const err = new Error(msg);
  err.cause = lastErr;
  throw err;
}

function mapCategory(c, lang) {
  const id = String(c?._id ?? c?.id ?? "");
  const title = pickLocalized(c, lang) || String(c?.name ?? c?.title ?? "");
  // بک شما تو محصول‌ها categoryName ذخیره می‌کنه، اینجا هم ممکنه همین باشه
  const categoryName = String(c?.categoryName ?? c?.name_en ?? c?.name ?? c?.title ?? title ?? "");
  const slug = toSlug(c?.slug ?? categoryName ?? title);

  return {
    id,
    slug,
    title,
    // برای merge کردن با subCategory
    __key: categoryName || title || slug || id,
  };
}

function mapSubCategory(sc, lang) {
  const id = String(sc?._id ?? sc?.id ?? "");
  const title = pickLocalized(sc, lang) || String(sc?.name ?? sc?.title ?? "");

  // چند حالت رایج تو بک‌ها:
  // - categoryName / parentCategoryName (string)
  // - categoryId / category (objectId)
  const categoryName =
    sc?.categoryName ??
    sc?.parentCategoryName ??
    sc?.parentName ??
    "";

  const categoryId =
    sc?.categoryId ??
    sc?.category ??
    sc?.parentCategoryId ??
    "";

  const slug = toSlug(sc?.slug ?? sc?.subCategoryName ?? sc?.name_en ?? sc?.name ?? title);

  return {
    id,
    slug,
    title,
    __categoryName: String(categoryName || ""),
    __categoryId: String(categoryId || ""),
  };
}

/**
 * خروجی دقیقاً مثل data/categories شماست:
 * [
 *   { slug, title, children:[{slug,title}] }
 * ]
 */
export async function shopGetNavCategories({ lang = "en" } = {}) {
  // هرچی endpoint‌ها باشه، یکی‌ش رو پیدا می‌کنه
  const [catsPayload, subsPayload] = await Promise.all([
    tryGetFirstWorking(CANDIDATE_CATEGORIES_ENDPOINTS),
    tryGetFirstWorking(CANDIDATE_SUBCATEGORIES_ENDPOINTS),
  ]);

  const catsRaw = normalizeArray(catsPayload);
  const subsRaw = normalizeArray(subsPayload);

  const cats = catsRaw.map((c) => mapCategory(c, lang));
  const subs = subsRaw.map((s) => mapSubCategory(s, lang));

  // ایندکس بر اساس key و id
  const byKey = new Map();
  const byId = new Map();

  for (const c of cats) {
    byKey.set(c.__key, c);
    if (c.id) byId.set(c.id, c);
  }

  // children attach
  const childrenByCatSlug = new Map(); // slug => children[]

  const pushChild = (catSlug, child) => {
    if (!catSlug) return;
    const prev = childrenByCatSlug.get(catSlug) || [];
    // جلوگیری از تکرار
    if (!prev.some((x) => x.slug === child.slug)) prev.push(child);
    childrenByCatSlug.set(catSlug, prev);
  };

  for (const s of subs) {
    // اول تلاش با categoryName
    let parent = null;

    if (s.__categoryName) {
      parent = byKey.get(String(s.__categoryName)) || null;

      // بعضی وقت‌ها key با name_en ساخته شده؛ اگر mismatch بود، slug match کنیم
      if (!parent) {
        const wantedSlug = toSlug(s.__categoryName);
        parent = cats.find((c) => c.slug === wantedSlug) || null;
      }
    }

    // بعد تلاش با categoryId
    if (!parent && s.__categoryId) {
      parent = byId.get(String(s.__categoryId)) || null;
    }

    // اگر هنوز پیدا نشد، این sub را نمی‌چسبونیم
    if (!parent) continue;

    pushChild(parent.slug, { slug: s.slug, title: s.title });
  }

  // خروجی نهایی با children
  const out = cats.map((c) => ({
    slug: c.slug,
    title: c.title,
    children: childrenByCatSlug.get(c.slug) || [],
  }));

  return out;
}
