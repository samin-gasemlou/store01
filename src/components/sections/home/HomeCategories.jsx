import { useEffect, useRef, useState } from "react";
import CategoryCard from "./CategoryCard";
import { categories } from "./data";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HomeCategories() {
  const trackRef = useRef(null);
  const itemRefs = useRef([]);

  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : true
  );

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (!mobile) setActive(0);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollToIndex = (i) => {
    const el = trackRef.current;
    const item = itemRefs.current[i];
    if (!el || !item) return;

    el.scrollTo({
      left: item.offsetLeft,
      behavior: "smooth",
    });
  };

  // موبایل: 2 کارت همزمان => آخرین ایندکس قابل نمایش = length - 2
  const maxIndex = Math.max(0, categories.length - 2);

  const prev = () => {
    const nextIndex = Math.max(active - 1, 0);
    setActive(nextIndex);
    scrollToIndex(nextIndex);
  };

  const next = () => {
    const nextIndex = Math.min(active + 1, maxIndex);
    setActive(nextIndex);
    scrollToIndex(nextIndex);
  };

  // ✅ sync active با اسکرول/درگ (حرفه‌ای)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      if (!isMobile) return;

      // نزدیک‌ترین کارت به سمت چپ
      let nearest = 0;
      let best = Infinity;

      for (let i = 0; i < itemRefs.current.length; i++) {
        const node = itemRefs.current[i];
        if (!node) continue;
        const d = Math.abs(node.offsetLeft - el.scrollLeft);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }

      // clamp چون 2 کارت همزمان داریم
      const clamped = Math.min(nearest, maxIndex);
      setActive(clamped);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isMobile, maxIndex]);

  return (
    <section className="w-full py-8 md:py-12 sm:mt-8 md:mb-16 relative z-50">
      {/* ✅ فلش‌ها فقط موبایل */}
      {isMobile && categories.length > 2 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full border border-[#1C1E1F] shadow-md sm:hidden"
            aria-label="Previous categories"
            type="button"
          >
            <ChevronLeft size={8} />
          </button>

          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full border border-[#1C1E1F] shadow-md sm:hidden"
            aria-label="Next categories"
            type="button"
          >
            <ChevronRight size={8} />
          </button>
        </>
      )}

      {/* ✅ هم‌عرض با بقیه سکشن‌ها */}
      <div className="w-full mx-auto px-2">
        {/* ✅ MOBILE: اسلایدر واقعی + درگ + بدون اسکرول‌بار */}
        <div
          ref={trackRef}
          className="
            flex
            gap-1.5
            overflow-x-auto
            no-scrollbar
            scroll-smooth
            snap-x snap-mandatory
            sm:hidden
            py-1
          "
        >
          {categories.map((item, i) => (
            <Link
              key={item.id}
              to={`/store/${encodeURIComponent(item.title)}`}
              ref={(el) => (itemRefs.current[i] = el)}
              className="
                shrink-0
                snap-start
                w-[calc((100%-12px)/3)]
              "
            >
              <CategoryCard {...item} />
            </Link>
          ))}
        </div>

        {/* ✅ sm+ : grid تمام عرض */}
        <div
          className="
            hidden sm:grid
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-6
            gap-4
            md:gap-6
            lg:gap-8
          "
        >
          {categories.map((item) => (
            <Link
              key={item.id}
              to={`/store/${encodeURIComponent(item.title)}`}
              className="w-full"
            >
              <CategoryCard {...item} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
