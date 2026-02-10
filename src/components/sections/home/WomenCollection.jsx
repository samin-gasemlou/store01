import { useRef } from "react";
import ProductCard from "../../common/ProductCard";
import { products } from "../../../data/products";

export default function WomenCollection() {
  const sliderRef = useRef(null);
  const cardRef = useRef(null);

  const scroll = (direction) => {
    if (!sliderRef.current || !cardRef.current) return;

    const cardWidth = cardRef.current.offsetWidth + 20;
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
          {/* کارت‌ها سمت چپ */}
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

          {/* ✅ تصویر سمت راست در دسکتاپ */}
          <ImageBlock />
        </div>
      </div>
    </section>
  );
}

function Header({ onLeft, onRight }) {
  return (
    <div className="flex w-full items-center justify-between mb-2 pt-4">
      <h2 className="text-[18px] sm:text-[20px] md:text-[24px]">
        Just Landed
      </h2>

      <div className="flex gap-2">
        <button onClick={onLeft} className="w-9 h-9">
          <img src="/arrow-circle-left.svg" alt="" />
        </button>
        <button onClick={onRight} className="w-9 h-9">
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
        src="/womenn.png"
        className="w-[215px] h-[413px] object-cover rounded-[10px]"
        alt=""
      />
    </div>
  );
}
