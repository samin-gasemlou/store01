import { useState } from "react";
import { sliderData } from "./sliderData";

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  const nextSlide = () => {
    setActive((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActive((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
  };

  return (
    <div className="w-full md:mt-16 mt-12 px-3 sm:px-4 z-50">
      <div
        className="
          relative isolate
          mx-auto
          w-full
          max-w-7xl
          h-[200px]
          sm:h-[280px]
          md:h-[340px]
          lg:h-[400px]
          overflow-hidden
          rounded-[10px]
          md:rounded-2xl
          bg-black
          touch-manipulation
        "
      >
        
        {sliderData.map((item, index) => (
          <img
            key={item.id}
            src={item.image}
            alt=""
            className={`
              absolute inset-0 w-full h-full object-cover
              transition-opacity duration-500 pointer-events-none
              ${index === active ? "opacity-100" : "opacity-0"}
            `}
          />
        ))}

        {/* Buttons */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-[60]
                     w-9 h-9 rounded-full bg-white/80
                     flex items-center justify-center
                     shadow hover:bg-white transition
                     pointer-events-auto select-none"
        >
          <img src="/arrow-circle-left.svg" alt="" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-[60]
                     w-9 h-9 rounded-full bg-white/80
                     flex items-center justify-center
                     shadow hover:bg-white transition
                     pointer-events-auto select-none"
        >
          <img src="/arrow-circle-left3.svg" alt="" />
        </button>

        {/* Indicator */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none z-50">
          <div
            className="
              bg-white
              w-[120px] sm:w-[140px]
              h-6 sm:h-7
              rounded-t-full
              flex items-center justify-center gap-2
              shadow
            "
          >
            {sliderData.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-6 bg-[#273959]" : "w-3 bg-[#D1D5DB]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
