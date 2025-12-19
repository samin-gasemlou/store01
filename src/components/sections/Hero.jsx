import { useState } from "react";

export default function Hero() {
  const slides = [
    {
      img: "./img1.png", // عکس عطر | تو باید اینو بزاری داخل public
      title: "Discover Your Signature Scent.",
      subtitle: "Timeless Elegance. Crafted for You.",
    },
    {
      img: "./img1.png",
      title: "Luxury Fragrances for Every Moment.",
      subtitle: "Aromas That Define Your Presence.",
    },
    {
      img: "./img1.png",
      title: "Elevate Your Style with Premium Perfume.",
      subtitle: "Made for Those Who Stand Out.",
    },
  ];

  const [current, setCurrent] = useState(0);

  return (
    <section className="w-[95%] sm:mt-2">
      <div className="relative max-w-[1400px] mx-auto rounded-4xl overflow-hidden">

        {/* SLIDE */}
        <div className="relative w-full h-[250px] md:h-[520px] flex items-stretch">

          {/* IMAGE */}
          <div className="w-full hidden md:block">
            <img
              src={slides[current].img}
              className="w-full h-full object-cover"
            />
          </div>

          {/* For mobile: full background */}
          <img
            src={slides[current].img}
            className="absolute inset-0 w-full h-full object-cover md:hidden"
          />
        </div>

        {/* SLIDER DOTS */}
       <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
  {/* White trapezoid box */}
  <div className="relative w-60 h-12 mx-auto">
    <div className="
      absolute left-1/2 -translate-x-1/2 sm:top-2 top-8
      sm:w-[220px] w-[90px] h-5 sm:h-10 
      bg-white shadow-md
      rounded-none
      clip-trapezoid
    "></div>

    {/* Dots (centered inside) */}
    <div className="absolute top-8 sm:top-0 inset-0 flex items-center justify-center gap-2">
      {slides.map((_, index) => (
        <div
          key={index}
          onClick={() => setCurrent(index)}
          className={`
            cursor-pointer transition-all duration-300
            ${current === index 
              ? "bg-orange-500 sm:w-9 w-4 h-2 rounded-full"
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
