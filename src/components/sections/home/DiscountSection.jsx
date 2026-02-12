import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../../common/ProductCard";
import { products } from "../../../data/products";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * ✅ RTL-safe scroll helpers (بدون دست زدن به استایل)
 * نرمال‌سازی scrollLeft تا همیشه مثل LTR رفتار کنیم (۰ = چپ‌ترین، max = راست‌ترین)
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

  // reverse (Chrome/Edge): scrollLeft starts > 0
  if (el.scrollLeft > 0) {
    document.body.removeChild(el);
    return "reverse";
  }

  // try set 1:
  el.scrollLeft = 1;

  // negative (Firefox): stays 0 after setting 1
  if (el.scrollLeft === 0) {
    document.body.removeChild(el);
    return "negative";
  }

  // default (Safari): becomes 1
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

  if (RTL_SCROLL_TYPE === "negative") {
    // Firefox: rightmost 0, leftmost -max
    return el.scrollLeft + max;
  }
  if (RTL_SCROLL_TYPE === "default") {
    // Safari: rightmost 0, leftmost max
    return max - el.scrollLeft;
  }
  // Chrome/Edge reverse: leftmost 0, rightmost max
  return el.scrollLeft;
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

export default function DiscountSection() {
  const { t, i18n } = useTranslation();

  // ✅ مهم: کوردی رو RTL حساب کن (به i18n.dir() اعتماد نکن)
  const lang = (i18n.language || "en").split("-")[0];
  const isRTL = lang === "ar" || lang === "ku";

  const sliderRef = useRef(null);
  const firstItemRef = useRef(null);

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

  const baseItems = useMemo(() => products.filter(Boolean), []);
  const loopItems = useMemo(() => {
    if (!baseItems.length) return [];
    return [...baseItems, ...baseItems, ...baseItems];
  }, [baseItems]);

  const getVisibleCount = () => {
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 768) return 3;
    return 2;
  };

  const [cardStep, setCardStep] = useState(0);
  const segmentWidthRef = useRef(0);

  const rafRef = useRef(null);
  const snapTimerRef = useRef(null);

  const isJumpingRef = useRef(false);

  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startNormLeftRef = useRef(0);
  const movedRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);

  useEffect(() => {
    const calc = () => {
      if (!firstItemRef.current) return;
      const gap = 20; // gap-5
      const w = firstItemRef.current.offsetWidth + gap;
      setCardStep(w);
      segmentWidthRef.current = w * baseItems.length;
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [baseItems.length]);

  // ✅ شروع از وسط (RTL-safe)
  useEffect(() => {
    const el = sliderRef.current;
    if (!el || !cardStep || !baseItems.length) return;

    const seg = segmentWidthRef.current;
    const groupStep = getVisibleCount() * cardStep;

    const mid = seg;
    const snapped = Math.round(mid / groupStep) * groupStep;

    scrollToNormalized(el, snapped, isRTL, "auto");
  }, [cardStep, baseItems.length, isRTL]);

  const snapToGroup = (behavior = "smooth") => {
    const el = sliderRef.current;
    if (!el || !cardStep) return;

    const groupStep = getVisibleCount() * cardStep;
    const norm = getNormalizedScrollLeft(el, isRTL);
    const newNorm = Math.round(norm / groupStep) * groupStep;

    scrollToNormalized(el, newNorm, isRTL, behavior);
  };

  const seamlessJump = (newNorm) => {
    const el = sliderRef.current;
    if (!el) return;

    isJumpingRef.current = true;

    const prevSnap = el.style.scrollSnapType;
    const prevBehavior = el.style.scrollBehavior;

    el.style.scrollSnapType = "none";
    el.style.scrollBehavior = "auto";

    requestAnimationFrame(() => {
      el.scrollLeft = toNativeScrollLeft(el, newNorm, isRTL);

      requestAnimationFrame(() => {
        el.style.scrollSnapType = prevSnap || "";
        el.style.scrollBehavior = prevBehavior || "";
        isJumpingRef.current = false;
      });
    });
  };

  const onScroll = () => {
    const el = sliderRef.current;
    if (!el || !baseItems.length) return;
    if (isJumpingRef.current) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const seg = segmentWidthRef.current;
      if (!seg) return;

      const norm = getNormalizedScrollLeft(el, isRTL);

      if (norm < seg * 0.35) seamlessJump(norm + seg);
      else if (norm > seg * 2.65) seamlessJump(norm - seg);
    });

    if (isPointerDownRef.current) return;

    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    snapTimerRef.current = setTimeout(() => {
      if (!isJumpingRef.current) snapToGroup("smooth");
    }, 140);
  };

  const scrollByGroup = (direction) => {
    const el = sliderRef.current;
    if (!el || !cardStep) return;

    const groupStep = getVisibleCount() * cardStep;
    const norm = getNormalizedScrollLeft(el, isRTL);
    const target = norm + direction * groupStep;

    scrollToNormalized(el, target, isRTL, "smooth");

    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    snapTimerRef.current = setTimeout(() => {
      if (!isJumpingRef.current) snapToGroup("smooth");
    }, 220);
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const THRESHOLD = 8;
    const VELOCITY_TRIGGER = 0.6;

    const onDown = (e) => {
      if (e.target.closest("button,a,input,textarea,select,label")) return;

      isPointerDownRef.current = true;
      movedRef.current = false;

      startXRef.current = e.clientX;
      startNormLeftRef.current = getNormalizedScrollLeft(el, isRTL);

      lastXRef.current = e.clientX;
      lastTRef.current = performance.now();
    };

    const onMove = (e) => {
      if (!isPointerDownRef.current) return;

      const dxRaw = e.clientX - startXRef.current;
      const dx = isRTL ? -dxRaw : dxRaw;

      if (!movedRef.current && Math.abs(dxRaw) >= THRESHOLD) {
        movedRef.current = true;
      }
      if (!movedRef.current) return;

      const nextNorm = startNormLeftRef.current - dx;
      el.scrollLeft = toNativeScrollLeft(el, nextNorm, isRTL);

      lastXRef.current = e.clientX;
      lastTRef.current = performance.now();

      e.preventDefault();
    };

    const onUp = (e) => {
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;

      if (!movedRef.current) {
        snapToGroup("auto");
        return;
      }

      const endX = e.clientX;
      const totalDxRaw = endX - startXRef.current;
      const totalDx = isRTL ? -totalDxRaw : totalDxRaw;

      const now = performance.now();
      const dt = Math.max(1, now - lastTRef.current);
      const vxRaw = (endX - lastXRef.current) / dt;
      const vx = isRTL ? -vxRaw : vxRaw;

      const groupStep = getVisibleCount() * cardStep;

      const shouldMove =
        Math.abs(totalDx) > groupStep * 0.15 || Math.abs(vx) > VELOCITY_TRIGGER;

      if (shouldMove) {
        const dir = totalDx < 0 ? 1 : -1;
        scrollByGroup(dir);
      } else {
        snapToGroup("smooth");
      }

      movedRef.current = false;
    };

    el.addEventListener("pointerdown", onDown, { passive: true });
    el.addEventListener("pointermove", onMove, { passive: false });
    el.addEventListener("pointerup", onUp, { passive: true });
    el.addEventListener("pointercancel", onUp, { passive: true });
    el.addEventListener("pointerleave", onUp, { passive: true });

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onUp);
    };
  }, [cardStep, isRTL]);

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
  aria-label="prev"
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
  aria-label="next"
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
