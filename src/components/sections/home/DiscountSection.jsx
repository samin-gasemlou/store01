import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../../common/ProductCard";
import { products } from "../../../data/products";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DiscountSection() {
  const sliderRef = useRef(null);
  const firstItemRef = useRef(null);

  // ---------------- TIMER ----------------
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

  // ---------------- LOOP DATA ----------------
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

  // ✅ برای لوپ نامحسوس
  const isJumpingRef = useRef(false);

  // ✅ برای drag گروهی
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startLeftRef = useRef(0);
  const movedRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);

  // ---------------- MEASURE ----------------
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

  // ---------------- START FROM MIDDLE ----------------
  useEffect(() => {
    const el = sliderRef.current;
    if (!el || !cardStep || !baseItems.length) return;

    const seg = segmentWidthRef.current;
    const groupStep = getVisibleCount() * cardStep;

    el.scrollLeft = seg;
    el.scrollLeft = Math.round(el.scrollLeft / groupStep) * groupStep;
  }, [cardStep, baseItems.length]);

  // ---------------- GROUP SNAP ----------------
  const snapToGroup = (behavior = "smooth") => {
    const el = sliderRef.current;
    if (!el || !cardStep) return;

    const groupStep = getVisibleCount() * cardStep;
    const newPos = Math.round(el.scrollLeft / groupStep) * groupStep;

    el.scrollTo({ left: newPos, behavior });
  };

  // ✅ لوپ نامحسوس: snap & smooth موقتاً خاموش
  const seamlessJump = (newScrollLeft) => {
    const el = sliderRef.current;
    if (!el) return;

    isJumpingRef.current = true;

    const prevSnap = el.style.scrollSnapType;
    const prevBehavior = el.style.scrollBehavior;

    el.style.scrollSnapType = "none";
    el.style.scrollBehavior = "auto";

    requestAnimationFrame(() => {
      el.scrollLeft = newScrollLeft;

      requestAnimationFrame(() => {
        el.style.scrollSnapType = prevSnap || "";
        el.style.scrollBehavior = prevBehavior || "";
        isJumpingRef.current = false;
      });
    });
  };

  // ---------------- INFINITE LOOP + schedule group snap ----------------
  const onScroll = () => {
    const el = sliderRef.current;
    if (!el || !baseItems.length) return;
    if (isJumpingRef.current) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const seg = segmentWidthRef.current;
      if (!seg) return;

      if (el.scrollLeft < seg * 0.35) seamlessJump(el.scrollLeft + seg);
      else if (el.scrollLeft > seg * 2.65) seamlessJump(el.scrollLeft - seg);
    });

    // اسنپ گروهی بعد از توقف اسکرول (ولی موقع pointerdown نزن)
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

    el.scrollBy({
      left: direction * groupStep,
      behavior: "smooth",
    });

    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    snapTimerRef.current = setTimeout(() => {
      if (!isJumpingRef.current) snapToGroup("smooth");
    }, 220);
  };

  // ---------------- ✅ DRAG: ALWAYS GROUP SNAP ON RELEASE ----------------
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const THRESHOLD = 8; // px (برای اینکه کلیک خراب نشه)
    const VELOCITY_TRIGGER = 0.6; // px/ms

    const onDown = (e) => {
      // روی لینک/دکمه داخل کارت درگ شروع نشه تا کلیک کار کنه
      if (e.target.closest("button,a,input,textarea,select,label")) return;

      isPointerDownRef.current = true;
      movedRef.current = false;

      startXRef.current = e.clientX;
      startLeftRef.current = el.scrollLeft;

      lastXRef.current = e.clientX;
      lastTRef.current = performance.now();
    };

    const onMove = (e) => {
      if (!isPointerDownRef.current) return;

      const dx = e.clientX - startXRef.current;

      if (!movedRef.current && Math.abs(dx) >= THRESHOLD) {
        movedRef.current = true;
      }
      if (!movedRef.current) return;

      // drag طبیعی
      el.scrollLeft = startLeftRef.current - dx;

      // برای محاسبه سرعت
      lastXRef.current = e.clientX;
      lastTRef.current = performance.now();

      // وقتی درگ واقعی شد، جلوگیری از انتخاب متن
      e.preventDefault();
    };

    const onUp = (e) => {
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;

      // اگر اصلاً درگ واقعی نبود => همونجا اسنپ کن (ولی کلیک لینک رو خراب نکن)
      if (!movedRef.current) {
        // اسنپ نرم نزن که احساس “تکان” نده
        snapToGroup("auto");
        return;
      }

      // جهت + سرعت
      const endX = e.clientX;
      const totalDx = endX - startXRef.current;

      const now = performance.now();
      const dt = Math.max(1, now - lastTRef.current);
      const vx = (endX - lastXRef.current) / dt; // px/ms

      const groupStep = getVisibleCount() * cardStep;

      // تصمیم: اگر کشیدن زیاد بود یا سرعت زیاد بود => گروه بعد/قبل
      const shouldMove =
        Math.abs(totalDx) > groupStep * 0.15 || Math.abs(vx) > VELOCITY_TRIGGER;

      if (shouldMove) {
        // اگر کاربر به چپ کشید (dx منفی) => باید به راست اسکرول کنیم (next)
        const dir = totalDx < 0 ? 1 : -1;
        scrollByGroup(dir);
      } else {
        // کم کشیده => برگرد به نزدیک‌ترین گروه
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
  }, [cardStep]);

  return (
    <section className="w-full relative py-10 md:py-14 overflow-x-hidden bg-[#2B4168] md:mb-20 mb-12 mt-4 rounded-[10px]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 text-white">
          <div className="flex items-center gap-6">
            <h2 className="text-[16px] sm:text-[18px] md:text-[22px] font-medium">
              Special discount
            </h2>

            <div className="flex items-center gap-2 text-sm">
              <TimeBox value={hh} label="Hours" />
              <span>:</span>
              <TimeBox value={mm} label="Min" />
              <span>:</span>
              <TimeBox value={ss} label="Sec" />
            </div>
          </div>

          {/* Arrows (desktop too) */}
          <div className="md:flex gap-2 hidden">
            <button
              onClick={() => scrollByGroup(-1)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center border border-[#ffffff81]"
              type="button"
              aria-label="prev"
            >
              <ChevronLeft className="text-white" size={22} />
            </button>

            <button
              onClick={() => scrollByGroup(1)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center border border-[#ffffff81]"
              type="button"
              aria-label="next"
            >
              <ChevronRight className="text-white" size={22} />
            </button>
          </div>
        </div>

        {/* Slider */}
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
