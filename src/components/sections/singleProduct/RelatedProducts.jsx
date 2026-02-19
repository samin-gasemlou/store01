import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../../common/ProductCard";
import { useTranslation } from "react-i18next";
import * as productsApi from "../../../services/shopProductsApi";

const AUTOPLAY_DELAY = 4000;

/**
 * RTL-safe scroll helpers
 */
function detectRtlScrollType() {
  if (typeof document === "undefined") return "reverse";

  const el = document.createElement("div");
  el.dir = "rtl";
  el.style.width = "100px";
  el.style.height = "100px";
  el.style.overflow = "scroll";
  el.style.position = "absolute";
  el.style.top = "-9999px";
  el.style.left = "-9999px";

  const inner = document.createElement("div");
  inner.style.width = "200px";
  inner.style.height = "1px";
  el.appendChild(inner);

  document.body.appendChild(el);

  if (el.scrollLeft > 0) {
    document.body.removeChild(el);
    return "reverse"; // Chrome/Edge
  }

  el.scrollLeft = 1;
  if (el.scrollLeft === 0) {
    document.body.removeChild(el);
    return "negative"; // Firefox
  }

  document.body.removeChild(el);
  return "default"; // Safari
}

const RTL_SCROLL_TYPE =
  typeof window !== "undefined" ? detectRtlScrollType() : "reverse";

function getMaxScrollLeft(el) {
  return Math.max(0, el.scrollWidth - el.clientWidth);
}

function getNormalizedScrollLeft(el, isRTL) {
  const max = getMaxScrollLeft(el);
  if (!isRTL) return el.scrollLeft;

  if (RTL_SCROLL_TYPE === "negative") return el.scrollLeft + max;
  if (RTL_SCROLL_TYPE === "default") return max - el.scrollLeft;
  return el.scrollLeft; // reverse (Chrome/Edge)
}

function toNativeScrollLeft(el, normalizedLeft, isRTL) {
  const max = getMaxScrollLeft(el);
  const n = Math.min(max, Math.max(0, normalizedLeft));

  if (!isRTL) return n;

  if (RTL_SCROLL_TYPE === "negative") return n - max;
  if (RTL_SCROLL_TYPE === "default") return max - n;
  return n; // reverse
}

function scrollToNormalized(el, normalizedLeft, isRTL, behavior = "auto") {
  el.scrollTo({
    left: toNativeScrollLeft(el, normalizedLeft, isRTL),
    behavior,
  });
}

const BASE_URL =
  (import.meta?.env?.VITE_API_BASE_URL || "").replace(/\/$/, "") ||
  "http://localhost:4000";

function toAbsImg(url) {
  if (!url) return "";
  const s = String(url);
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `${BASE_URL}${s.startsWith("/") ? "" : "/"}${s}`;
}

/**
 * ✅ normalize برای اینکه:
 * "make up" == "makeup" == "Make-Up" == "MAKE_UP"
 */
function normalizeKey(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[\u200C\u200D]/g, "") // ZWNJ/ZWJ
    .replace(/[\s\-_]+/g, "") // spaces, hyphen, underscore -> remove
    .replace(/[^\p{L}\p{N}]+/gu, ""); // remove other symbols (unicode-safe)
}

function mapProductToCard(p) {
  const id = p?._id ?? p?.id ?? "";
  const title = p?.title ?? p?.name_fa ?? p?.name_en ?? p?.name ?? "";

  const imgRaw =
    p?.img ??
    p?.mainImage ??
    (Array.isArray(p?.images) ? p.images[0] : "") ??
    "";

  const price = p?.price ?? p?.salePrice ?? p?.finalPrice ?? p?.amount ?? 0;

  // ✅ بک شما categoryName / subCategoryName میده
  const category = p?.categoryName ?? p?.category ?? "";
  const subCategory = p?.subCategoryName ?? p?.subCategory ?? "";

  return {
    id: String(id),
    title,
    img: toAbsImg(imgRaw),
    price,
    category,
    subCategory,
  };
}

export default function RelatedProducts({ currentProductId, currentCategory }) {
  const { t, i18n } = useTranslation();

  const lang = (i18n.language || "en").split("-")[0];
  const isRTL = lang === "ar" || lang === "ku";

  const sliderRef = useRef(null);
  const firstItemRef = useRef(null);
  const intervalRef = useRef(null);

  const segmentWidthRef = useRef(0);
  const rafRef = useRef(null);
  const lockJumpRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);

        const out = await productsApi.shopListProducts({ page: 1, limit: 500 });

        const raw =
          (Array.isArray(out) ? out : null) ||
          (Array.isArray(out?.items) ? out.items : null) ||
          (Array.isArray(out?.data) ? out.data : null) ||
          (Array.isArray(out?.products) ? out.products : null) ||
          [];

        const mapped = raw.map(mapProductToCard);

        if (!alive) return;
        setItems(mapped);
      } catch {
        if (!alive) return;
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  const baseProducts = useMemo(() => {
    if (!items.length) return [];

    const catNorm = normalizeKey(currentCategory);
    if (!catNorm) return [];

    return items
      .filter((p) => {
        const sameCategory = normalizeKey(p.category) === catNorm;
        const notSameProduct = String(p.id) !== String(currentProductId);
        return sameCategory && notSameProduct;
      })
      .slice(0, 10);
  }, [items, currentProductId, currentCategory]);

  const loopProducts = useMemo(() => {
    if (!baseProducts.length) return [];
    return [...baseProducts, ...baseProducts, ...baseProducts];
  }, [baseProducts]);

  useEffect(() => {
    const calc = () => {
      const item = firstItemRef.current;
      if (!item) return;

      const gap = 24; // gap-6
      const cardWidth = item.offsetWidth + gap;
      segmentWidthRef.current = cardWidth * baseProducts.length;
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [baseProducts.length]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el || !baseProducts.length) return;

    const seg = segmentWidthRef.current;
    if (!seg) return;

    el.classList.remove("scroll-smooth");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToNormalized(el, seg, isRTL, "auto");
        requestAnimationFrame(() => el.classList.add("scroll-smooth"));
      });
    });
  }, [baseProducts.length, isRTL]);

  const onScroll = () => {
    const el = sliderRef.current;
    if (!el) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const seg = segmentWidthRef.current;
      if (!seg) return;
      if (lockJumpRef.current) return;

      const norm = getNormalizedScrollLeft(el, isRTL);

      if (norm < seg * 0.5) {
        lockJumpRef.current = true;
        el.classList.remove("scroll-smooth");
        scrollToNormalized(el, norm + seg, isRTL, "auto");
        requestAnimationFrame(() => {
          el.classList.add("scroll-smooth");
          lockJumpRef.current = false;
        });
      } else if (norm > seg * 2.5) {
        lockJumpRef.current = true;
        el.classList.remove("scroll-smooth");
        scrollToNormalized(el, norm - seg, isRTL, "auto");
        requestAnimationFrame(() => {
          el.classList.add("scroll-smooth");
          lockJumpRef.current = false;
        });
      }
    });
  };

  const scrollByGroup = (dir = 1) => {
    const el = sliderRef.current;
    const item = firstItemRef.current;
    if (!el || !item) return;

    const gap = 24;
    const cardWidth = item.offsetWidth + gap;
    const step = window.innerWidth < 768 ? 2 : 4;

    const norm = getNormalizedScrollLeft(el, isRTL);
    const target = norm + dir * cardWidth * step;

    scrollToNormalized(el, target, isRTL, "smooth");
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    intervalRef.current = setInterval(() => {
      scrollByGroup(1);
    }, AUTOPLAY_DELAY);

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRTL]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startNorm = 0;
    let moved = false;
    const THRESHOLD = 6;

    const onDown = (e) => {
      if (e.target.closest("button,a")) return;

      isDown = true;
      moved = false;
      startX = e.clientX;
      startNorm = getNormalizedScrollLeft(el, isRTL);

      el.style.cursor = "grabbing";
      el.setPointerCapture?.(e.pointerId);
    };

    const onMove = (e) => {
      if (!isDown) return;

      const dxRaw = e.clientX - startX;
      const dx = isRTL ? -dxRaw : dxRaw;

      if (!moved && Math.abs(dxRaw) > THRESHOLD) moved = true;
      if (!moved) return;

      const nextNorm = startNorm - dx;
      el.scrollLeft = toNativeScrollLeft(el, nextNorm, isRTL);

      e.preventDefault();
    };

    const onUp = () => {
      isDown = false;
      moved = false;
      el.style.cursor = "";
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove, { passive: false });
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [isRTL]);

  if (loading || !baseProducts.length) return null;

  const prevIcon = "/arrow-circle-left.svg";
  const nextIcon = "/arrow-circle-left3.svg";
  const leftIcon = isRTL ? nextIcon : prevIcon;
  const rightIcon = isRTL ? prevIcon : nextIcon;

  return (
    <section className="w-full px-4 mt-6 mb-24 overflow-x-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg md:text-xl font-semibold">{t("single.related")}</h3>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => scrollByGroup(-1)}
            type="button"
            className="w-9 h-9 flex items-center justify-center"
          >
            <img src={leftIcon} alt="" />
          </button>

          <button
            onClick={() => scrollByGroup(1)}
            type="button"
            className="w-9 h-9 flex items-center justify-center"
          >
            <img src={rightIcon} alt="" />
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
        dir={isRTL ? "rtl" : "ltr"}
        onScroll={onScroll}
        className="
          flex gap-6 overflow-x-auto no-scrollbar
          scroll-smooth snap-x snap-mandatory
          select-none cursor-grab active:cursor-grabbing
        "
      >
        {loopProducts.map((product, index) => (
          <div
            key={`${product?.id ?? "p"}-${index}`}
            ref={index === 0 ? firstItemRef : null}
            className="
              shrink-0 snap-start
              w-[calc((100%-24px)/2)]
              md:w-[calc((100%-120px)/5)]
            "
          >
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </section>
  );
}
