import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";
import { useTranslation } from "react-i18next";

// ✅ اتصال به بک
import { shopListProducts } from "../services/shopProductsApi";

function getBackendOrigin() {
  const base =
    (import.meta.env?.VITE_API_BASE_URL || "").replace(/\/+$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "");
  try {
    return new URL(base).origin;
  } catch {
    return base;
  }
}

function normalizeUploadsUrl(urlLike) {
  const s = String(urlLike || "");
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/uploads/")) return `${getBackendOrigin()}${s}`;
  return s;
}

function mapProductToCard(p, lang) {
  const id = p?._id ?? p?.id ?? "";
  const l = String(lang || "en").split("-")[0];

  const title =
    (l === "ar"
      ? p?.name_ar
      : l === "ku"
      ? p?.name_kur || p?.name_ku
      : p?.name_en) ||
    p?.name_en ||
    p?.name_ar ||
    p?.name_kur ||
    p?.name_ku ||
    p?.name ||
    p?.title ||
    "";

  const imgRaw =
    p?.mainImage ||
    p?.img ||
    p?.image ||
    p?.thumbnail ||
    (Array.isArray(p?.images) ? p.images[0] : "") ||
    "";

  return {
    id: String(id),
    title,
    img: normalizeUploadsUrl(imgRaw),
    price: Number(p?.price ?? 0),
  };
}

export default function SearchPage() {
  const { t, i18n } = useTranslation();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("q") || "";

  const [query, setQuery] = useState(initialQuery);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const lang = (i18n.language || "en").split("-")[0];

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // ✅ سرچ از بک
  useEffect(() => {
    let alive = true;
    const q = String(query || "").trim();

    (async () => {
      try {
        setLoading(true);

        // بک: /api/v1/products/public (در controller خودش isActive/isHidden را اعمال می‌کند)
        const out = await shopListProducts({
          page: 1,
          limit: 200,
          q,
          fields:
            "_id,name_en,name_ar,name_ku,name_kur,name,price,mainImage,image,thumbnail,isActive,isHidden",
        });

        const raw =
          (Array.isArray(out) ? out : null) ||
          (Array.isArray(out?.data) ? out.data : null) ||
          (Array.isArray(out?.items) ? out.items : null) ||
          (Array.isArray(out?.products) ? out.products : null) ||
          [];

        const mapped = raw
          .map((p) => mapProductToCard(p, lang))
          .filter((x) => x?.id);

        if (!alive) return;
        setItems(mapped);
      } catch (e) {
        console.error("search products failed:", e);
        if (!alive) return;
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [query, lang]);

  const filteredProducts = useMemo(() => {
    // اگر بک q را دقیق پیاده نکرده باشد، این fallback هم کمک می‌کند
    const q = String(query || "").trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => String(p.title || "").toLowerCase().includes(q));
  }, [items, query]);

  return (
    <section className="w-full flex flex-col items-center">
      <Navbar />

      {/* SEARCH HEADER */}
      <div className="w-full px-2 mt-10 lg:block hidden">
        <h1 className="text-xl font-semibold text-center mb-6">
          {t("search.title")}
        </h1>

        {/* SEARCH INPUT */}
        <div className="w-full mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            className="w-full border rounded-xl px-5 py-3 text-sm outline-none"
          />
        </div>
      </div>

      {/* RESULTS */}
      <div className="w-full px-4 md:mt-10 mt-20 mb-20">
        {loading ? (
          <p className="text-center text-gray-500">{t("search.loading") || "..."}</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">{t("search.noResults")}</p>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
              gap-6
            "
          >
            {filteredProducts.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </section>
  );
}
