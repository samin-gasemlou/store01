// WomenCollection.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../../common/ProductCard";
import { products } from "../../../data/products";

export default function WomenCollection({
  items = products,
  baseCount = 5,
  mobileStep = 2,
  desktopStep = 4,
  imageSrc = "/womenn.png",
}) {
  const sliderRef = useRef(null);
  const firstItemRef = useRef(null);

  const baseItems = useMemo(() => {
    const arr = Array.isArray(items) ? items.filter(Boolean) : [];
    return arr.slice(0, baseCount);
  }, [items, baseCount]);

  const loopItems = useMemo(() => {
    if (!baseItems.length) return [];
    return [...baseItems, ...baseItems, ...baseItems];
  }, [baseItems]);

  const [cardStep, setCardStep] = useState(0);
  const segmentWidthRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const calc = () => {
      if (!firstItemRef.current) return;
      const cardWidth = firstItemRef.current.offsetWidth + 20; // gap-5 => 20px
      setCardStep(cardWidth);
      segmentWidthRef.current = cardWidth * baseItems.length;
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [baseItems.length]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el || !baseItems.length) return;

    const t = setTimeout(() => {
      const seg = segmentWidthRef.current;
      if (!seg) return;
      el.scrollLeft = seg;
    }, 0);

    return () => clearTimeout(t);
  }, [baseItems.length]);

  const onScroll = () => {
    const el = sliderRef.current;
    if (!el || !baseItems.length) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const seg = segmentWidthRef.current;
      if (!seg) return;

      if (el.scrollLeft < seg * 0.5) el.scrollLeft += seg;
      else if (el.scrollLeft > seg * 2.5) el.scrollLeft -= seg;
    });
  };

  const scrollByStep = (direction) => {
    const el = sliderRef.current;
    if (!el || !cardStep) return;

    const step = window.innerWidth < 768 ? mobileStep : desktopStep;

    el.scrollBy({
      left: direction * cardStep * step,
      behavior: "smooth",
    });
  };

  // ✅ Drag حرفه‌ای با threshold (کلیک خراب نشه)
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
    };

    const onMove = (e) => {
      if (!isDown) return;

      const dx = e.clientX - startX;

      if (!moved && Math.abs(dx) > THRESHOLD) moved = true;
      if (!moved) return;

      el.scrollLeft = startLeft - dx;
      e.preventDefault();
    };

    const onUp = () => {
      isDown = false;
      moved = false;
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
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
  }, []);

  return (
    <section className="w-full relative overflow-x-hidden md:mb-20">
      <div className="w-full mx-auto px-2">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* ✅ کارت‌ها سمت چپ */}
          <div className="w-full md:flex-1 relative min-w-0">
            <Header
              onLeft={() => scrollByStep(-1)}
              onRight={() => scrollByStep(1)}
            />

            <div
              ref={sliderRef}
              onScroll={onScroll}
              className="w-full flex gap-5 overflow-x-auto no-scrollbar py-2 cursor-grab active:cursor-grabbing select-none"
            >
              {loopItems.map((item, idx) => (
                <div
                  key={`${item?.id ?? "item"}-${idx}`}
                  ref={idx === 0 ? firstItemRef : null}
                  className="
                    shrink-0
                    w-[calc((100%-20px)/2)]
                    md:w-[calc((100%-40px)/3)]
                    lg:w-[calc((100%-60px)/5)]
                  "
                >
                  <ProductCard {...item} />
                </div>
              ))}
            </div>
          </div>

          {/* ✅ تصویر سمت راست در دسکتاپ */}
          <ImageBlock imageSrc={imageSrc} />
        </div>
      </div>
    </section>
  );
}

function Header({ onLeft, onRight }) {
  return (
    <div className="flex w-full items-center justify-between mb-2 pt-4">
      <h2 className="text-[18px] sm:text-[20px] md:text-[24px]">Just Landed</h2>

      <div className="flex gap-0 shrink-0">
        <button onClick={onLeft} type="button" className="w-8 h-8">
          <img src="/arrow-circle-left.svg" className="w-6 md:w-full" alt="" />
        </button>
        <button onClick={onRight} type="button" className="w-8 h-8">
          <img src="/arrow-circle-left3.svg " className="w-6 md:w-full" alt="" />
        </button>
      </div>
    </div>
  );
}

function ImageBlock({ imageSrc }) {
  return (
    <div className="hidden lg:flex shrink-0">
      <img
        src={imageSrc}
        className="w-[300px] h-[413px] object-cover rounded-[10px]"
        alt=""
        draggable={false}
      />
    </div>
  );
}
