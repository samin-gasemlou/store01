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
    <section className="w-full flex items-center justify-center md:mb-26 relative">

      {/* BG Light */}
      <div
        className="
          absolute w-[705px] h-[705px] right-0 top-0 
          bg-[radial-gradient(50%_50%_at_50%_50%,rgba(43,65,104,0.15)_0%,rgba(43,65,104,0)_100%)]
          pointer-events-none
        "
      />

      <div className="w-full mx-auto px-4 relative">
  <div className="flex flex-row items-center justify-between gap-4">

    {/* SLIDER */}
    <div
      className="
        w-full md:w-[71%]
        relative
        md:absolute md:right-10 md:bottom-0
      "
    >
      <Header
        onLeft={() => scroll(-1)}
        onRight={() => scroll(1)}
      />

      <div
        ref={sliderRef}
        className="flex gap-5 overflow-x-scroll scrollbar-hide snap-x snap-mandatory py-2"
        style={{ scrollbarWidth: "none" }}
      >
        <div
          ref={cardRef}
          className="snap-start flex items-center gap-4"
        >
          {products.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>

    {/* IMAGE */}
    <ImageBlock />

  </div>
</div>

    </section>
  );
}

function Header({ onLeft, onRight }) {
  return (
    <div className="flex items-center justify-between mb-2 pt-4">
      <h2 className="font-normal text-[24px] leading-[27px] text-black">
        Most Wanted Collection
      </h2>

      <div className="flex gap-2">
        <button onClick={onLeft} className="w-9 h-9">
          <img src="/arrow-circle-left.svg" />
        </button>
        <button onClick={onRight} className="w-9 h-9">
          <img src="/arrow-circle-left2.svg" />
        </button>
      </div>
    </div>
  );
}

function ImageBlock() {
  return (
    <div className="flex items-center justify-center">
      <img
        src="/menn.png"
        className="hidden md:block w-[283px] h-[413px] object-cover rounded-3xl"
        alt=""
      />
    </div>
  );
}
