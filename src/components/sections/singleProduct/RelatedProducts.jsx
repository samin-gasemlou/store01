import { useEffect, useMemo, useRef } from "react";
import ProductCard from "../../common/ProductCard";
import { products as allProducts } from "../../../data/products";
import { useTranslation } from "react-i18next";

const AUTOPLAY_DELAY = 4000;

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

  // ✅ اندازه segment
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

  // ✅ شروع از وسط (با دو RAF برای اطمینان)
  useEffect(() => {
    const el = sliderRef.current;
    if (!el || !baseProducts.length) return;

    const seg = segmentWidthRef.current;
    if (!seg) return;

    el.classList.remove("scroll-smooth");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollLeft = seg;
        requestAnimationFrame(() => {
          el.classList.add("scroll-smooth");
        });
      });
    });
  }, [baseProducts.length]);

  // ✅ infinite loop (همیشه LTR)
  const onScroll = () => {
    const el = sliderRef.current;
    if (!el) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const seg = segmentWidthRef.current;
      if (!seg) return;
      if (lockJumpRef.current) return;

      if (el.scrollLeft < seg * 0.5) {
        lockJumpRef.current = true;
        el.classList.remove("scroll-smooth");
        el.scrollLeft += seg;
        requestAnimationFrame(() => {
          el.classList.add("scroll-smooth");
          lockJumpRef.current = false;
        });
      } else if (el.scrollLeft > seg * 2.5) {
        lockJumpRef.current = true;
        el.classList.remove("scroll-smooth");
        el.scrollLeft -= seg;
        requestAnimationFrame(() => {
          el.classList.add("scroll-smooth");
          lockJumpRef.current = false;
        });
      }
    });
  };

  // ✅ اسکرول گروهی (LTR واقعی)
  const scrollByGroup = (dir = 1) => {
    const el = sliderRef.current;
    const item = firstItemRef.current;
    if (!el || !item) return;

    const gap = 24;
    const cardWidth = item.offsetWidth + gap;
    const step = window.innerWidth < 768 ? 2 : 4;

    // چون در RTL ظاهر mirror شده، برای حس درست باید جهت برعکس بشه
    const direction = isRTL ? -dir : dir;

    el.scrollBy({
      left: direction * cardWidth * step,
      behavior: "smooth",
    });
  };

  // ✅ autoplay
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    intervalRef.current = setInterval(() => {
      scrollByGroup(1);
    }, AUTOPLAY_DELAY);

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRTL]);

  // ✅ Drag (LTR scroll, ولی RTL حس دست درست)
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;
    const THRESHOLD = 6;

    const onDown = (e) => {
      if (e.target.closest("button,a")) return;

      isDown = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.style.cursor = "grabbing";
      el.setPointerCapture?.(e.pointerId);
    };

    const onMove = (e) => {
      if (!isDown) return;

      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > THRESHOLD) moved = true;
      if (!moved) return;

      // LTR: startLeft - dx
      // RTL (mirror): startLeft + dx
      el.scrollLeft = isRTL ? startLeft + dx : startLeft - dx;
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

  if (!baseProducts.length) return null;

  // ✅ آیکون‌ها در RTL برعکس
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

      {/* ✅ کلیدی‌ترین بخش: اسکرولر LTR، ولی در RTL mirror میشه */}
      <div
        ref={sliderRef}
        dir="ltr"
        onScroll={onScroll}
        className={`
          flex gap-6 overflow-x-auto no-scrollbar
          scroll-smooth snap-x snap-mandatory
          select-none cursor-grab active:cursor-grabbing
          ${isRTL ? "-scale-x-100" : ""}
        `}
      >
        {loopProducts.map((product, index) => (
          <div
            key={`${product?.id ?? "p"}-${index}`}
            ref={index === 0 ? firstItemRef : null}
            className={`
              shrink-0 snap-start
              w-[calc((100%-24px)/2)]
              md:w-[calc((100%-120px)/5)]
              ${isRTL ? "-scale-x-100" : ""}
            `}
          >
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </section>
  );
}
