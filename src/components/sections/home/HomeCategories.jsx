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

  const maxIndex = Math.max(0, categories.length - 2); // موبایل: 2 کارت همزمان

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

  return (
    <section className="w-full  py-8 md:py-12  sm:mt-8 md:mb-16 relative z-50">
      {/* ✅ فلش‌ها فقط موبایل */}
      {isMobile && categories.length > 2 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md sm:hidden"
            aria-label="Previous categories"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md sm:hidden"
            aria-label="Next categories"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* ✅ هم‌عرض با بقیه سکشن‌ها */}
      <div className="w-full  mx-auto px-4">
        {/* ✅ MOBILE: اسلایدر تمام عرض داخل container */}
        <div
          ref={trackRef}
          className="
            flex
            gap-3
            sm:gap-4
            overflow-hidden
            sm:hidden
          "
        >
          {categories.map((item, i) => (
            <Link
              key={item.id}
              to={`/store/${encodeURIComponent(item.title)}`}
              className="shrink-0 w-[48%]"
              ref={(el) => (itemRefs.current[i] = el)}
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
