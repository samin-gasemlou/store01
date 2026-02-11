import { useEffect, useMemo, useRef } from "react";
import ProductCard from "../../common/ProductCard";
import { products as allProducts } from "../../../data/products";
import { useTranslation } from "react-i18next";

const AUTOPLAY_DELAY = 4000;

// ✅ detect RTL scroll behavior (chrome/edge/firefox)
function getRtlScrollType() {
  if (typeof document === "undefined") return "default";
  const div = document.createElement("div");
  div.dir = "rtl";
  div.style.width = "100px";
  div.style.height = "100px";
  div.style.overflow = "scroll";
  div.style.position = "absolute";
  div.style.top = "-9999px";

  const inner = document.createElement("div");
  inner.style.width = "200px";
  inner.style.height = "100px";
  div.appendChild(inner);
  document.body.appendChild(div);

  div.scrollLeft = 0;
  const a = div.scrollLeft;
  div.scrollLeft = 1;
  const b = div.scrollLeft;

  document.body.removeChild(div);

  if (a > 0) return "reverse";
  if (b === 0) return "negative";
  return "default";
}

export default function RelatedProducts({ currentProductId, currentCategory }) {
  const { t, i18n } = useTranslation();

  const lang = (i18n.language || "en").split("-")[0];
  const isRTL = lang === "ar" || lang === "ku";
  const rtlTypeRef = useRef(getRtlScrollType());

  const sliderRef = useRef(null);
  const firstItemRef = useRef(null);
  const intervalRef = useRef(null);

  const segmentWidthRef = useRef(0);
  const rafRef = useRef(null);
  const lockJumpRef = useRef(false);

  const baseProducts = useMemo(() => {
    return allProducts
      .filter(
        (p) =>
          p.category === currentCategory &&
          String(p.id) !== String(currentProductId)
      )
      .slice(0, 10);
  }, [currentProductId, currentCategory]);

  const loopProducts = useMemo(() => {
    if (!baseProducts.length) return [];
    return [...baseProducts, ...baseProducts, ...baseProducts];
  }, [baseProducts]);

  // ✅ normalized axis helpers (RTL-safe)
  const getX = () => {
    const el = sliderRef.current;
    if (!el) return 0;

    if (!isRTL) return el.scrollLeft;

    const max = el.scrollWidth - el.clientWidth;
    const type = rtlTypeRef.current;

    if (type === "negative") return -el.scrollLeft;
    if (type === "reverse") return max - el.scrollLeft;
    return el.scrollLeft; // default
  };

  const setX = (x) => {
    const el = sliderRef.current;
    if (!el) return;

    if (!isRTL) {
      el.scrollLeft = x;
      return;
    }

    const max = el.scrollWidth - el.clientWidth;
    const type = rtlTypeRef.current;

    if (type === "negative") el.scrollLeft = -x;
    else if (type === "reverse") el.scrollLeft = max - x;
    else el.scrollLeft = x;
  };

  const scrollByX = (dx, behavior = "smooth") => {
    const el = sliderRef.current;
    if (!el) return;
    const next = getX() + dx;

    if (!isRTL) {
      el.scrollTo({ left: next, behavior });
      return;
    }

    const max = el.scrollWidth - el.clientWidth;
    const type = rtlTypeRef.current;
    let raw = next;

    if (type === "negative") raw = -next;
    else if (type === "reverse") raw = max - next;

    el.scrollTo({ left: raw, behavior });
  };

  // ✅ measure segment width
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

  // ✅ start from middle (RTL-safe)
  useEffect(() => {
    const el = sliderRef.current;
    if (!el || !baseProducts.length) return;

    const seg = segmentWidthRef.current;
    if (!seg) return;

    // next tick to ensure scrollWidth is ready
    requestAnimationFrame(() => setX(seg));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseProducts.length, isRTL]);

  // ✅ infinite loop (RTL-safe)
  const onScroll = () => {
    const el = sliderRef.current;
    if (!el) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const seg = segmentWidthRef.current;
      if (!seg) return;
      if (lockJumpRef.current) return;

      const x = getX();

      if (x < seg * 0.5) {
        lockJumpRef.current = true;
        el.classList.remove("scroll-smooth");
        setX(x + seg);
        requestAnimationFrame(() => {
          el.classList.add("scroll-smooth");
          lockJumpRef.current = false;
        });
      } else if (x > seg * 2.5) {
        lockJumpRef.current = true;
        el.classList.remove("scroll-smooth");
        setX(x - seg);
        requestAnimationFrame(() => {
          el.classList.add("scroll-smooth");
          lockJumpRef.current = false;
        });
      }
    });
  };

  // ✅ group scroll (RTL-safe)
  const scrollByGroup = (dir = 1) => {
    const item = firstItemRef.current;
    if (!item) return;

    const gap = 24;
    const cardWidth = item.offsetWidth + gap;
    const step = window.innerWidth < 768 ? 2 : 4;

    scrollByX(dir * cardWidth * step, "smooth");
  };

  // ✅ autoplay (RTL-safe)
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    intervalRef.current = setInterval(() => {
      scrollByGroup(1);
    }, AUTOPLAY_DELAY);

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRTL]);

  // ✅ Drag (RTL-safe + threshold)
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startAxis = 0;
    let moved = false;
    const THRESHOLD = 6;

    const onDown = (e) => {
      if (e.target.closest("button,a")) return;

      isDown = true;
      moved = false;
      startX = e.clientX;
      startAxis = getX();
      el.style.cursor = "grabbing";
      el.setPointerCapture?.(e.pointerId);
    };

    const onMove = (e) => {
      if (!isDown) return;

      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > THRESHOLD) moved = true;
      if (!moved) return;

      setX(startAxis - dx);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRTL]);

  if (!baseProducts.length) return null;

  // ✅ Icons: LTR => left=prev, right=next | RTL => left=next, right=prev
  const prevIcon = "/arrow-circle-left.svg";
  const nextIcon = "/arrow-circle-left3.svg";

  const leftBtnIcon = isRTL ? nextIcon : prevIcon;
  const rightBtnIcon = isRTL ? prevIcon : nextIcon;

  // ✅ Button actions should also flip in RTL
  const onLeftClick = () => scrollByGroup(isRTL ? 1 : -1);
  const onRightClick = () => scrollByGroup(isRTL ? -1 : 1);

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full px-4 mt-6 mb-24 overflow-x-hidden"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg md:text-xl font-semibold">{t("single.related")}</h3>

        {/* ✅ icons swap in RTL */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onLeftClick}
            type="button"
            className="w-9 h-9 flex items-center justify-center"
            aria-label={isRTL ? t("pagination.next") : t("pagination.prev")}
          >
            <img src={leftBtnIcon} alt="" />
          </button>

          <button
            onClick={onRightClick}
            type="button"
            className="w-9 h-9 flex items-center justify-center"
            aria-label={isRTL ? t("pagination.prev") : t("pagination.next")}
          >
            <img src={rightBtnIcon} alt="" />
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
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
