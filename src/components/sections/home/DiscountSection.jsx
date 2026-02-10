import { useRef } from "react";
import ProductCard from "../../common/ProductCard";
import { products } from "../../../data/products";

export default function DiscountSection() {
  const sliderRef = useRef(null);
  const cardRef = useRef(null);

  const scroll = (direction) => {
    if (!sliderRef.current || !cardRef.current) return;

    const cardWidth = cardRef.current.offsetWidth + 20; // gap-5
    const step = window.innerWidth < 768 ? 2 : 4;

    sliderRef.current.scrollBy({
      left: direction * cardWidth * step,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="
        w-full
        relative
        py-10
        md:py-14
        overflow-x-hidden
        bg-[#2B4168] md:mb-20 mb-12 mt-4 rounded-[10px]
      "
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 text-white">
          <div className="flex items-center gap-6">
            <h2 className="text-[16px] sm:text-[18px] md:text-[22px] font-medium">
              Special discount
            </h2>

            {/* Timer */}
            <div className="flex items-center gap-2 text-sm">
              <TimeBox value="08" label="Hours" />
              <span>:</span>
              <TimeBox value="33" label="Min" />
              <span>:</span>
              <TimeBox value="00" label="Sec" />
            </div>
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            <button onClick={() => scroll(-1)}>
              <img src="/arrow-circle-left-white.svg" alt="" />
            </button>
            <button onClick={() => scroll(1)}>
              <img src="/arrow-circle-right-white.svg" alt="" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto no-scrollbar"
        >
          <div ref={cardRef} className="flex gap-5">
            {products.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center border border-white/50 rounded-md px-2 py-1 min-w-[44px]">
      <span className="text-[14px] md:text-[16px] font-semibold">
        {value}
      </span>
      <span className="text-[10px] opacity-80">{label}</span>
    </div>
  );
}
