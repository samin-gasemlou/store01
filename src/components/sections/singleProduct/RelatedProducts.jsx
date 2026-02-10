import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../common/ProductCard";
import { products as allProducts } from "../../../data/products";

const AUTOPLAY_DELAY = 4000;

export default function RelatedProducts({ currentProductId, currentCategory }) {
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const products = allProducts
    .filter(
      (p) =>
        p.category === currentCategory &&
        String(p.id) !== String(currentProductId)
    )
    .slice(0, 15);

  const loopProducts = [...products, ...products, ...products];

  const scrollByCard = (dir = 1) => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.scrollLeft = slider.scrollWidth / 3;

    intervalRef.current = setInterval(() => {
      scrollByCard(1);
    }, AUTOPLAY_DELAY);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <section className="w-full px-4 mt-6 mb-26 overflow-x-hidden">
      <div className="flex justify-between mb-6">
        <h3 className="text-xl font-semibold">Related products</h3>
        <div className="flex gap-2">
          <button onClick={() => scrollByCard(-1)} className="w-9 h-9 border rounded-full">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scrollByCard(1)} className="w-9 h-9 border rounded-full">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto no-scrollbar pb-4"
      >
        {loopProducts.map((product, index) => (
          <div
            key={index}
            className="shrink-0 w-[85%] sm:w-[48%] md:w-[220px]"
          >
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </section>
  );
}
