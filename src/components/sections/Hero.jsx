import { useState } from "react";
export default function Hero() {
  const slides = [
    {
      img: "./img1.png",
      title: "Discover Your Signature Scent.",
      subtitle: "Timeless Elegance. Crafted for You.",
    },
    {
      img: "./img2.png",
      title: "Luxury Fragrances for Every Moment.",
      subtitle: "Aromas That Define Your Presence.",
    },
    {
      img: "./img3.png",
      title: "Elevate Your Style with Premium Perfume.",
      subtitle: "Made for Those Who Stand Out.",
    },
  ];

  const [current, setCurrent] = useState(0);

  return (

    <section className="w-full sm:mt-2 mb-8">
      <div className="relative max-w-[1400px] mx-auto rounded-4xl overflow-hidden">

        {/* SLIDE */}
        <div className="relative w-full h-[250px] md:h-[520px]">

          {/* DESKTOP IMAGE */}
          <div className="hidden md:block w-full h-full relative">
            {slides.map((slide, index) => (
              <img
                key={index}
                src={slide.img}
                className={`
                  absolute inset-0 w-full h-full object-cover
                  transition-all duration-500 ease-in-out
                  ${current === index
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"}
                `}
              />
            ))}
          </div>

          {/* MOBILE IMAGE */}
          <div className="md:hidden w-full h-full relative">
            {slides.map((slide, index) => (
              <img
                key={index}
                src={slide.img}
                className={`
                  absolute inset-0 w-full h-full object-cover
                  transition-opacity duration-500 ease-in-out
                  ${current === index ? "opacity-100" : "opacity-0"}
                `}
              />
            ))}
          </div>

        </div>

        {/* SLIDER DOTS */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <div className="relative w-60 h-12 mx-auto">

            <div className="
              absolute left-1/2 -translate-x-1/2 sm:top-2 top-8
              sm:w-[220px] w-[90px] h-5 sm:h-10 
              bg-white shadow-md
              clip-trapezoid
            "></div>

            <div className="absolute top-8 sm:top-0 inset-0 flex items-center justify-center gap-2">
              {slides.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`
                    cursor-pointer transition-all duration-300
                    ${current === index
                      ? "bg-[#2B4168] sm:w-9 w-4 h-2 rounded-full"
                      : "bg-gray-300 sm:w-6 w-2 h-1.5 rounded-full"}
                  `}
                />
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
