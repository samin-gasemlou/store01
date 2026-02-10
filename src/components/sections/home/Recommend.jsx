import { useRef } from "react";
import ProductCard from "../../common/ProductCard";
import { products } from "../../../data/products";

export default function Recommend() {
  const sliderRef = useRef(null);
  const cardRef = useRef(null);

  const scroll = (direction) => {
    if (!sliderRef.current || !cardRef.current) return;

    const cardWidth = cardRef.current.offsetWidth + 20; // gap-5 => 20px
    // موبایل: 2تا 2تا | دسکتاپ (md+): 4تا 4تا
    const step = window.innerWidth < 768 ? 2 : 4;

    sliderRef.current.scrollBy({
      left: direction * cardWidth * step,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full relative overflow-x-hidden md:mb-20">
      <div className="w-full mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* ✅ عکس سمت چپ (در md+) */}
          <ImageBlock />

          {/* کارت‌ها سمت راست */}
          <div className="w-full md:w-[82%] relative">
            <Header onLeft={() => scroll(-1)} onRight={() => scroll(1)} />

            <div
              ref={sliderRef}
              className="flex gap-5 overflow-x-auto no-scrollbar snap-x py-2"
            >
              <div ref={cardRef} className="flex gap-4 snap-start">
                {products.map((item) => (
                  <ProductCard key={item.id} {...item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Header({ onLeft, onRight }) {
  return (
    <div className="flex w-full justify-between mb-2 pt-4">
      <h2 className="text-[18px] sm:text-[20px] md:text-[24px]">
        Most Wanted Collection
      </h2>

      <div className="flex gap-2">
        <button onClick={onLeft}>
          <img src="/arrow-circle-left.svg" alt="" />
        </button>
        <button onClick={onRight}>
          <img src="/arrow-circle-left2.svg" alt="" />
        </button>
      </div>
    </div>
  );
}

function ImageBlock() {
  return (
    <div className="hidden md:flex shrink-0">
      <img
        src="/menn.png"
        className="w-[215px] h-[413px] object-cover rounded-[10px]"
        alt=""
      />
    </div>
  );
}
