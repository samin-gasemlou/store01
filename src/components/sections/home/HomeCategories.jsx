import { useState, useRef, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import { categories } from "./data";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HomeCategories() {
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);

  const visibleCount = 4; // تعداد کارت قابل نمایش در موبایل
  const [cardWidth, setCardWidth] = useState(0);

  // گرفتن عرض هر کارت بعد از رندر
  useEffect(() => {
    if (containerRef.current) {
      const firstCard = containerRef.current.children[0];
      if (firstCard) setCardWidth(firstCard.offsetWidth + 32); // gap=8 => 32px در 4 کارت
    }
  }, []);

  const prev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const next = () => {
    setIndex((prev) =>
      Math.min(prev + 1, categories.length - visibleCount)
    );
  };

  return (
    <section className="w-full flex items-center justify-center py-8 md:py-12 bg-transparent sm:mt-8 md:mb-16 relative z-50">
      {/* فلش‌ها فقط موبایل */}
      {categories.length > visibleCount && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md sm:hidden"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md sm:hidden"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      <div className="w-full max-w-7xl mx-auto px-4 overflow-hidden">
        <div
          ref={containerRef}
          className="flex md:gap-8 gap-3 transition-transform duration-300 ease-in-out sm:grid sm:grid-cols-3 lg:grid-cols-6"
          style={{
            transform: `translateX(-${index * cardWidth}px)`,
          }}
        >
          {categories.map((item) => (
            <Link
              key={item.id}
              to={`/store/${encodeURIComponent(item.title)}`}
              className="shrink-0 w-[45%] sm:w-full md:w-full"
            >
              <CategoryCard {...item} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
