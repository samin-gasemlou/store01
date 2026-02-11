import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../../common/ProductCard";
import { products } from "../../../data/products";

export default function MenCollection() {
  const sliderRef = useRef(null);
  const firstItemRef = useRef(null);

  // ✅ فقط ۴ محصول
  const baseItems = useMemo(() => products.slice(0, 4), []);
  const loopItems = useMemo(
    () => [...baseItems, ...baseItems, ...baseItems],
    [baseItems]
  );

  const [cardStep, setCardStep] = useState(0);
  const segmentWidthRef = useRef(0);
  const rafRef = useRef(null);

  // ✅ اندازه‌گیری عرض کارت + gap (gap-5 => 20px)
  useEffect(() => {
    const calc = () => {
      if (!firstItemRef.current) return;
      const cardWidth = firstItemRef.current.offsetWidth + 20;
      setCardStep(cardWidth);
      segmentWidthRef.current = cardWidth * baseItems.length; // ۴ کارت
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [baseItems.length]);

  // ✅ شروع از وسط
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const t = setTimeout(() => {
      const seg = segmentWidthRef.current;
      if (!seg) return;
      el.scrollLeft = seg;
    }, 0);

    return () => clearTimeout(t);
  }, []);

  // ✅ Loop هنگام اسکرول
  const onScroll = () => {
    const el = sliderRef.current;
    if (!el) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const seg = segmentWidthRef.current;
      if (!seg) return;

      if (el.scrollLeft < seg * 0.5) el.scrollLeft += seg;
      else if (el.scrollLeft > seg * 2.5) el.scrollLeft -= seg;
    });
  };

  // ✅ دکمه‌ها (موبایل ۲تا۲تا، دسکتاپ ۴تا۴تا)
  const scrollByStep = (direction) => {
    const el = sliderRef.current;
    if (!el || !cardStep) return;

    const step = window.innerWidth < 768 ? 2 : 4;

    el.scrollBy({
      left: direction * cardStep * step,
      behavior: "smooth",
    });
  };

  // ✅ Drag با دست و موس (Pointer)
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startLeft = 0;

    const onDown = (e) => {
      isDown = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.setPointerCapture?.(e.pointerId);
    };

    const onMove = (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      el.scrollLeft = startLeft - dx;
    };

    const onUp = () => {
      isDown = false;
    };

    el.addEventListener("pointerdown", onDown, { passive: true });
    el.addEventListener("pointermove", onMove, { passive: true });
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
  }, []);

  return (
    <section className="w-full relative overflow-x-hidden md:mb-20">
      <div className="w-full mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <ImageBlock />

          <div className="w-full md:flex-1 relative">
            <Header
              onLeft={() => scrollByStep(-1)}
              onRight={() => scrollByStep(1)}
            />

            <div
              ref={sliderRef}
              onScroll={onScroll}
              className="flex gap-5 overflow-x-auto no-scrollbar py-2 cursor-grab active:cursor-grabbing"
            >
              {loopItems.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  ref={idx === 0 ? firstItemRef : null}
                  className="
                    shrink-0
                    w-[calc((100%)/2)]
                    md:w-[calc((100%-60px)/4)]
                  "
                >
                  <ProductCard {...item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Header({ onLeft, onRight }) {
  return (
    <div className="flex w-full justify-between mb-2 pt-4">
      <h2 className="text-[18px] sm:text-[20px] md:text-[24px]">
        Most Wanted Collection
      </h2>

      <div className="flex gap-2">
        <button onClick={onLeft}>
          <img src="/arrow-circle-left.svg" alt="" />
        </button>
        <button onClick={onRight}>
          <img src="/arrow-circle-left3.svg" alt="" />
        </button>
      </div>
    </div>
  );
}

function ImageBlock() {
  return (
    <div className="hidden md:flex shrink-0">
      <img
        src="/menn.png"
        className="w-[300px] h-[413px] object-cover rounded-[10px]"
        alt=""
      />
    </div>
  );
}
