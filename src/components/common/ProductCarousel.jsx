import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";

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

  // reverse => initial is max (positive)
  if (a > 0) return "reverse";
  // negative => stays 0 when set to 1 (firefox)
  if (b === 0) return "negative";
  // default => becomes 1
  return "default";
}

export default function MenCollection({
  items = [],
  baseCount = 5,
  mobileStep = 2,
  desktopStep = 5,
  imageSrc = "/menn.png",
}) {
  const { t, i18n } = useTranslation();

  const sliderRef = useRef(null);
  const firstItemRef = useRef(null);

  const lang = (i18n.language || "en").split("-")[0];
  const isRTL = lang === "ar" || lang === "ku";
  const rtlTypeRef = useRef(getRtlScrollType());

  // ✅ When drag happened, block the next click (so Links don't misfire)
  const blockClickRef = useRef(false);

  // ✅ normalized axis helpers
  const getX = () => {
    const el = sliderRef.current;
    if (!el) return 0;
    if (!isRTL) return el.scrollLeft;

    const max = el.scrollWidth - el.clientWidth;
    const type = rtlTypeRef.current;

    if (type === "negative") return -el.scrollLeft; // firefox
    if (type === "reverse") return max - el.scrollLeft; // chrome/edge
    return el.scrollLeft; // safari default-ish
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

  const baseItems = useMemo(() => {
    const arr = Array.isArray(items) ? items.filter(Boolean) : [];
    const sliced = arr.slice(0, baseCount);
    return sliced.length ? sliced : [];
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

  // ✅ start from middle
  useEffect(() => {
    const el = sliderRef.current;
    if (!el || !baseItems.length) return;

    const tmr = setTimeout(() => {
      const seg = segmentWidthRef.current;
      if (!seg) return;
      setX(seg);
    }, 0);

    return () => clearTimeout(tmr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseItems.length, isRTL]);

  // ✅ infinite loop
  const onScroll = () => {
    const el = sliderRef.current;
    if (!el || !baseItems.length) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const seg = segmentWidthRef.current;
      if (!seg) return;

      const x = getX();
      if (x < seg * 0.5) setX(x + seg);
      else if (x > seg * 2.5) setX(x - seg);
    });
  };

  const scrollByStep = (direction) => {
    const el = sliderRef.current;
    if (!el || !cardStep) return;

    const step = window.innerWidth < 768 ? mobileStep : desktopStep;
    scrollByX(direction * cardStep * step, "smooth");
  };

  // ✅ Drag (RTL-safe) — FIXED so clicking cards still works
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    let isDown = false;
    let startClientX = 0;
    let startAxis = 0;
    let moved = false;
    let pid = null;

    const THRESHOLD = 6;

    const onDown = (e) => {
      // ✅ اگر روی لینک/دکمه کلیک شد، درگ رو شروع نکن
      if (e.target.closest("a,button,input,textarea,select,label")) return;

      isDown = true;
      moved = false;
      pid = e.pointerId;

      startClientX = e.clientX;
      startAxis = getX();
    };

    const onMove = (e) => {
      if (!isDown) return;

      const dx = e.clientX - startClientX;

      // ✅ تا وقتی threshold رد نشده، چیزی تغییر نده (کلیک خراب نشه)
      if (!moved && Math.abs(dx) < THRESHOLD) return;

      // ✅ اینجا یعنی drag واقعی شروع شده
      if (!moved) {
        moved = true;
        // ✅ فقط وقتی drag شروع شد capture کن (وگرنه کلیک Link می‌میره)
        try {
          el.setPointerCapture?.(pid);
        } catch { /* empty */ }
      }

      setX(startAxis - dx);
      e.preventDefault();
    };

    const end = () => {
      if (!isDown) return;
      isDown = false;

      // ✅ اگر drag انجام شد، کلیک بعدی رو بلاک کن تا کارت ناخواسته باز نشه/یا برعکس کلیک خراب نشه
      if (moved) {
        blockClickRef.current = true;
        window.setTimeout(() => {
          blockClickRef.current = false;
        }, 0);
      }

      moved = false;
      pid = null;
    };

    el.addEventListener("pointerdown", onDown, { passive: true });
    el.addEventListener("pointermove", onMove, { passive: false });
    el.addEventListener("pointerup", end, { passive: true });
    el.addEventListener("pointercancel", end, { passive: true });
    el.addEventListener("pointerleave", end, { passive: true });

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
      el.removeEventListener("pointerleave", end);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRTL]);

  return (
    <section className="w-full relative overflow-x-hidden md:mb-20">
      <div className="w-full mx-auto px-2">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <ImageBlock imageSrc={imageSrc} />

          <div className="w-full md:flex-1 relative min-w-0">
            <Header
              title={t("home.mostWanted")}
              isRTL={isRTL}
              onLeft={() => scrollByStep(isRTL ? 1 : -1)}
              onRight={() => scrollByStep(isRTL ? -1 : 1)}
            />

            <div
              ref={sliderRef}
              onScroll={onScroll}
              onClickCapture={(e) => {
                // ✅ اگر همین الان drag انجام شده، کلیک رو بلاک کن
                if (blockClickRef.current) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className="w-full flex gap-5 overflow-x-auto no-scrollbar py-2 cursor-grab active:cursor-grabbing"
            >
              {loopItems.map((item, idx) => (
                <div
                  key={`${item?.id ?? "item"}-${idx}`}
                  ref={idx === 0 ? firstItemRef : null}
                  className="
                    shrink-0
                    w-[calc((100%-20px)/2)]
                    md:w-[calc((100%-20px)/2)]
                    lg:w-[calc((100%-90px)/5)]
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

function Header({ title, onLeft, onRight, isRTL }) {
  const leftIcon = isRTL ? "/arrow-circle-left3.svg" : "/arrow-circle-left.svg";
  const rightIcon = isRTL ? "/arrow-circle-left.svg" : "/arrow-circle-left3.svg";

  return (
    <div className="flex w-full items-center justify-between mb-2 pt-4">
      <h2 className="text-[18px] sm:text-[20px] md:text-[24px]">{title}</h2>

      <div className="flex md:gap-2 gap-0 shrink-0">
        <button onClick={onLeft} type="button" className="w-8 h-8">
          <img src={leftIcon} className="w-6 md:w-full" alt="" />
        </button>
        <button onClick={onRight} type="button" className="w-8 h-8">
          <img src={rightIcon} className="w-6 md:w-full" alt="" />
        </button>
      </div>
    </div>
  );
}

function ImageBlock({ imageSrc }) {
  return (
    <div className="hidden md:flex shrink-0">
      <img
        src={imageSrc}
        className="w-[300px] h-[413px] object-cover rounded-[10px]"
        alt=""
        draggable={false}
      />
    </div>
  );
}
