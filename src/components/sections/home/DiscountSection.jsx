import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../../common/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as productsApi from "../../../services/shopProductsApi";

/* ================= RTL SCROLL HELPERS (دست نخورده) ================= */

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
    return "reverse";
  }

  el.scrollLeft = 1;

  if (el.scrollLeft === 0) {
    document.body.removeChild(el);
    return "negative";
  }

  document.body.removeChild(el);
  return "default";
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
  return el.scrollLeft;
}

function toNativeScrollLeft(el, normalizedLeft, isRTL) {
  const max = getMaxScrollLeft(el);
  const n = Math.min(max, Math.max(0, normalizedLeft));

  if (!isRTL) return n;
  if (RTL_SCROLL_TYPE === "negative") return n - max;
  if (RTL_SCROLL_TYPE === "default") return max - n;
  return n;
}

function scrollToNormalized(el, normalizedLeft, isRTL, behavior = "auto") {
  el.scrollTo({
    left: toNativeScrollLeft(el, normalizedLeft, isRTL),
    behavior,
  });
}

/* ================= PRODUCT HELPERS ================= */

function getBackendOrigin() {
  const base =
    (import.meta.env?.VITE_API_BASE_URL || "").replace(/\/+$/, "") ||
    window.location.origin;

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

  if (s.startsWith("/uploads/")) {
    return `${getBackendOrigin()}${s}`;
  }

  return s;
}

function mapProductToCard(p, lang) {
  const id = p?._id ?? p?.id ?? "";

  const l = (lang || "en").split("-")[0];

  const title =
    p?.title ??
    (l === "ar"
      ? p?.name_ar
      : l === "ku"
      ? p?.name_kur || p?.name_ku
      : p?.name_en) ??
    p?.name_en ??
    p?.name_ar ??
    p?.name_kur ??
    p?.name_ku ??
    p?.name ??
    "";

  const imgRaw =
    p?.img ??
    p?.mainImage ??
    p?.image ??
    p?.thumbnail ??
    (Array.isArray(p?.images) ? p.images[0] : "") ??
    "";

  const img = normalizeUploadsUrl(imgRaw);

  const price = p?.price ?? p?.salePrice ?? p?.finalPrice ?? 0;

  return {
    id: String(id),
    title,
    img,
    price,
  };
}

/* ================= COMPONENT ================= */

export default function DiscountSection() {
  const { t, i18n } = useTranslation();

  const lang = (i18n.language || "en").split("-")[0];
  const isRTL = lang === "ar" || lang === "ku";

  const sliderRef = useRef(null);
  const firstItemRef = useRef(null);

  const [apiItems, setApiItems] = useState([]);
  const [apiLoaded, setApiLoaded] = useState(false);

  // ✅ فقط از دیتابیس بخوان
  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        const out = await productsApi.shopListProducts({
          page: 1,
          limit: 500,
        });

        const raw =
          (Array.isArray(out) ? out : null) ||
          (Array.isArray(out?.items) ? out.items : null) ||
          (Array.isArray(out?.data) ? out.data : null) ||
          [];

        const mapped = (raw || [])
          .map((p) => mapProductToCard(p, i18n.language))
          .filter((x) => x?.id && /^[a-fA-F0-9]{24}$/.test(x.id));

        if (!alive) return;
        setApiItems(mapped);
      } catch {
        if (!alive) return;
        setApiItems([]);
      } finally {
        if (alive) setApiLoaded(true);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [i18n.language]);

  /* ===== تایمر (دست نخورده) ===== */

  const deadline = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  }, []);

  const [remaining, setRemaining] = useState(() =>
    Math.max(0, deadline - Date.now())
  );

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const { hh, mm, ss } = useMemo(() => {
    const totalSec = Math.floor(remaining / 1000);
    return {
      hh: String(Math.floor(totalSec / 3600)).padStart(2, "0"),
      mm: String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0"),
      ss: String(totalSec % 60).padStart(2, "0"),
    };
  }, [remaining]);

  /* ===== Loop Items ===== */

  const baseItems = useMemo(
    () => apiItems.filter(Boolean),
    [apiItems]
  );

  const loopItems = useMemo(() => {
    if (!baseItems.length) return [];
    return [...baseItems, ...baseItems, ...baseItems];
  }, [baseItems]);

  /* ===== اسلایدر (کاملاً دست نخورده) ===== */

  const getVisibleCount = () => {
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 768) return 3;
    return 2;
  };

  const [cardStep, setCardStep] = useState(0);
  const segmentWidthRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const calc = () => {
      if (!firstItemRef.current) return;
      const gap = 20;
      const w = firstItemRef.current.offsetWidth + gap;
      setCardStep(w);
      segmentWidthRef.current = w * baseItems.length;
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [baseItems.length]);

  const onScroll = () => {
    const el = sliderRef.current;
    if (!el || !baseItems.length) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const seg = segmentWidthRef.current;
      if (!seg) return;

      const norm = getNormalizedScrollLeft(el, isRTL);

      if (norm < seg * 0.35)
        scrollToNormalized(el, norm + seg, isRTL, "auto");
      else if (norm > seg * 2.65)
        scrollToNormalized(el, norm - seg, isRTL, "auto");
    });
  };

  const scrollByGroup = (direction) => {
    const el = sliderRef.current;
    if (!el || !cardStep) return;

    const groupStep = getVisibleCount() * cardStep;
    const norm = getNormalizedScrollLeft(el, isRTL);
    const target = norm + direction * groupStep;

    scrollToNormalized(el, target, isRTL, "smooth");
  };

  if (!baseItems.length && !apiLoaded) return null;

  return (
    <section className="w-full relative py-10 md:py-14 overflow-x-hidden bg-[#2B4168] md:mb-20 mb-12 mt-4 rounded-[10px]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6 text-white">
          <div className="flex items-center gap-6">
            <h2 className="text-[16px] sm:text-[18px] md:text-[22px] font-medium">
              {t("home.specialDiscount")}
            </h2>

            <div className="flex items-center gap-2 text-sm">
              <TimeBox value={hh} label={t("timer.hours")} />
              <span>:</span>
              <TimeBox value={mm} label={t("timer.min")} />
              <span>:</span>
              <TimeBox value={ss} label={t("timer.sec")} />
            </div>
          </div>

          <div className="md:flex gap-2 hidden">
            <button
              onClick={() => scrollByGroup(isRTL ? 1 : -1)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center border border-[#ffffff81]"
              type="button"
            >
              {isRTL ? (
                <ChevronRight className="text-white" size={22} />
              ) : (
                <ChevronLeft className="text-white" size={22} />
              )}
            </button>

            <button
              onClick={() => scrollByGroup(isRTL ? -1 : 1)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center border border-[#ffffff81]"
              type="button"
            >
              {isRTL ? (
                <ChevronLeft className="text-white" size={22} />
              ) : (
                <ChevronRight className="text-white" size={22} />
              )}
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          onScroll={onScroll}
          className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1 select-none"
        >
          {loopItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              ref={idx === 0 ? firstItemRef : null}
              className="
                shrink-0 snap-start
                w-[calc((100%-20px)/2)]
                md:w-[calc((100%-40px)/3)]
                lg:w-[calc((100%-60px)/4)]
              "
            >
              <ProductCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center border border-white/50 rounded-md px-2 py-1 min-w-11">
      <span className="text-[14px] md:text-[16px] font-semibold">{value}</span>
      <span className="text-[10px] opacity-80">{label}</span>
    </div>
  );
}
