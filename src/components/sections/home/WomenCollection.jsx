import ProductCard from "../../common/ProductCard";
import { useRef } from "react";
import { products } from "../../../data/products";
export default function WomenCollection() {
  const sliderRef = useRef(null);
  const cardRef = useRef(null);

  const scrollLeft = () => {
    if (!sliderRef.current || !cardRef.current) return;
    const cardWidth = cardRef.current.offsetWidth + 20;
    sliderRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!sliderRef.current || !cardRef.current) return;
    const cardWidth = cardRef.current.offsetWidth + 20;
    sliderRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
  };

  return (
    <section className="w-full md:py-10 py-0 bg-[#F2F3F5] relative mt-12">

      <div
        className="
          absolute w-[705px] h-[705px] left-0 top-0 
          bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,105,59,0.15)_0%,rgba(153,63,35,0)_100%)]
          pointer-events-none
        "
      />

      <div className="max-w-7xl mx-auto px-4 flex flex-col items-end justify-center">

        <div className="flex flex-col md:flex-row gap-6 items-start justify-between relative w-full">

          {/* --- Slider (responsive wrapper) --- */}
          <div className="
            w-full md:w-[75%]
            md:absolute md:top-8 md:left-12 
            z-10
          ">

            {/* Title + arrows */}
            <div className="flex items-center justify-between mb-4 w-full pr-16">
              <h2 className="font-normal text-[24px] leading-[27px] text-black">
                Women's Collection
              </h2>

              <div className="flex items-center gap-2">
                <button onClick={scrollLeft} className="w-9 h-9 flex items-center justify-center">
                  <img src="/arrow-circle-left.svg" className="w-full" />
                </button>
                <button onClick={scrollRight} className="w-9 h-9 flex items-center justify-center">
                  <img src="/arrow-circle-left2.svg" className="w-full" />
                </button>
              </div>
            </div>

            {/* SCROLL SLIDER */}
                       <div
                         ref={sliderRef}
                         className="
                           flex
                           gap-5
                           overflow-x-scroll
                           scrollbar-hide
                           snap-x snap-mandatory
                           py-4
                         "
                         style={{ scrollbarWidth: "none" }}
                       >
                         <div className="snap-start flex items-center justify-center gap-4" ref={cardRef}> {products.map((item) => (
                                   <ProductCard key={item.id} {...item} />
                                 ))}</div>
                         
           
                       </div>
          </div>

          {/* --- Right image --- */}
          <div className="hidden md:block w-[25%] relative ml-auto">
            <img src="/loop2.svg" className="absolute top-48 right-0 w-full" alt="" />
            <img
              src="/womenn.png"
              className="w-full h-[450px] object-cover rounded-3xl relative"
              alt=""
            />
          </div>

        </div>
      </div>
    </section>
  );
}
