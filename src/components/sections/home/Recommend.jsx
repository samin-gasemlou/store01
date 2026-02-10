import { useRef } from "react";
import ProductCard from "../../common/ProductCard";
import { products } from "../../../data/products";

export default function Recommend() {
  const sliderRef = useRef(null);
  const cardRef = useRef(null);

  const scroll = (direction) => {
    if (!sliderRef.current || !cardRef.current) return;
    const cardWidth = cardRef.current.offsetWidth + 20;
    sliderRef.current.scrollBy({
      left: direction * cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full relative overflow-x-hidden md:mb-26">
      <div className="w-full mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4">

          <div className="w-full md:w-[71%] relative">
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

          <ImageBlock />
        </div>
      </div>
    </section>
  );
}

function Header({ onLeft, onRight }) {
  return (
    <div className="flex justify-between mb-2 pt-4">
      <h2 className="text-[24px]">Most Wanted Collection</h2>
      <div className="flex gap-2">
        <button onClick={onLeft}><img src="/arrow-circle-left.svg" /></button>
        <button onClick={onRight}><img src="/arrow-circle-left2.svg" /></button>
      </div>
    </div>
  );
}

function ImageBlock() {
  return (
    <div className="hidden md:flex shrink-0">
      <img
        src="/menn.png"
        className="w-[283px] h-[413px] object-cover rounded-3xl"
        alt=""
      />
    </div>
  );
}
