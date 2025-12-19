import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../common/ProductCard";
import { products as allProducts } from "../../../data/products";

export default function RelatedProducts({ currentProductId, currentCategory }) {
  const sliderRef = useRef(null);

  const scroll = (dir) => {
    sliderRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  const related = allProducts
    .filter(
      (p) => p.category === currentCategory && String(p.id) !== String(currentProductId)
    )
    .slice(0, 6);

  return (
    <section className="w-[90%] mx-auto px-4 mt-6 mb-26">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Related products</h3>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 rounded-full border flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 rounded-full border flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
      >
        {related.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            img={product.img}
            price={product.price}
          />
        ))}
      </div>
    </section>
  );
}
