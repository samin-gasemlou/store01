import { useRef } from "react";

export default function SponsorSlider() {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="w-full md:py-10 py-0 mt-0 mb-8 relative md:mt-24 md:mb-26">
      <div className="max-w-7xl mx-auto px-4 relative">

        {/* Buttons */}
        <button
          onClick={scrollLeft}
          className="
            absolute left-2 top-1/2 -translate-y-1/2 
            z-20 w-10 h-10 rounded-full
            flex items-center justify-center
          "
        >
          <img src="./arrow-left.svg" className="w-5" />
        </button>

        <button
          onClick={scrollRight}
          className="
            absolute right-2 top-1/2 -translate-y-1/2 
            z-20 w-10 h-10 rounded-full
            flex items-center justify-center
          "
        >
          <img src="./arrow-right.svg" className="w-5" />
        </button>

        {/* SLIDER */}
        <div
          ref={sliderRef}
          className="
            flex items-center gap-8 overflow-x-scroll scroll-smooth
            scrollbar-hide py-4 justify-between p-12
          "
          style={{ scrollbarWidth: "none" }}
        >
          {/* Sponsor Logos */}
          <SponsorLogo src="/chanel.png" />
          <SponsorLogo src="/armani.png" />
          <SponsorLogo src="/dior.png" />
          <SponsorLogo src="/gucci.png" />
          <SponsorLogo src="/hermes.png" />
          <SponsorLogo src="/versace.png" />
        </div>
      </div>
    </section>
  );
}

function SponsorLogo({ src }) {
  return (
    <div className="min-w-[120px] flex items-center justify-center">
      <img src={src} className="w-24 opacity-80 hover:opacity-100 transition" />
    </div>
  );
}

