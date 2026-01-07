import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../common/ProductCard";
import { products as allProducts } from "../../../data/products";

const AUTOPLAY_DELAY = 4000;

export default function RelatedProducts({ currentProductId, currentCategory }) {
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // 15 related products
  const products = allProducts
    .filter(
      (p) =>
        p.category === currentCategory &&
        String(p.id) !== String(currentProductId)
    )
    .slice(0, 15);

  // clone for infinite loop
  const loopProducts = [...products, ...products, ...products];

  /* ---------- SCROLL LOGIC ---------- */
  const scrollByCard = (dir = 1) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.querySelector(".product-card");
    if (!card) return;

    slider.scrollBy({
      left: dir * card.offsetWidth,
      behavior: "smooth",
    });
  };

  /* ---------- AUTOPLAY ---------- */
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    // start from middle copy
    slider.scrollLeft = slider.scrollWidth / 3;

    intervalRef.current = setInterval(() => {
      scrollByCard(1);
    }, AUTOPLAY_DELAY);

    return () => clearInterval(intervalRef.current);
  }, []);

  /* ---------- INFINITE RESET ---------- */
  const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const third = slider.scrollWidth / 3;

    if (slider.scrollLeft <= 0) {
      slider.scrollLeft += third;
    } else if (slider.scrollLeft >= third * 2) {
      slider.scrollLeft -= third;
    }
  };

  /* ---------- DRAG ---------- */
  const onPointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX;
    scrollLeft.current = sliderRef.current.scrollLeft;
    clearInterval(intervalRef.current);
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const walk = startX.current - e.pageX;
    sliderRef.current.scrollLeft = scrollLeft.current + walk;
  };

  const onPointerUp = () => {
    isDragging.current = false;
    intervalRef.current = setInterval(() => {
      scrollByCard(1);
    }, AUTOPLAY_DELAY);
  };

  return (
    <section className="w-[90%] mx-auto px-4 mt-6 mb-26">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Related products</h3>

        <div className="flex gap-2">
          <button
            onClick={() => scrollByCard(-1)}
            className="w-9 h-9 rounded-full border flex items-center justify-center
                       transition hover:bg-black hover:text-white"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollByCard(1)}
            className="w-9 h-9 rounded-full border flex items-center justify-center
                       transition hover:bg-black hover:text-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="
          flex gap-12 overflow-x-scroll no-scrollbar
          cursor-grab active:cursor-grabbing
          scroll-smooth pb-4 select-none
        "
      >
        {loopProducts.map((product, index) => (
          <div
            key={index}
            className="product-card shrink-0 w-[45%] sm:w-[220px]"
          >
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </section>
  );
}
