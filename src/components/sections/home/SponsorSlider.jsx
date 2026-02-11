import { useEffect, useMemo, useRef } from "react";

export default function SponsorSlider({
  logos = ["/chanel.png", "/armani.png", "/dior.png", "/gucci.png", "/hermes.png", "/versace.png"],
  repeat = 3,        // ✅ اگر اسکرول کم بود، بیشترش کن (مثلاً 4)
  stepPx = 300,      // ✅ مقدار اسکرول دکمه‌ها
}) {
  const sliderRef = useRef(null);

  // ✅ زیاد کردن آیتم‌ها برای اینکه اسکرول حتماً داشته باشه
  const loopLogos = useMemo(() => {
    const arr = Array.isArray(logos) ? logos.filter(Boolean) : [];
    if (!arr.length) return [];
    return Array.from({ length: repeat }, () => arr).flat();
  }, [logos, repeat]);

  const scrollLeft = () => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: -stepPx, behavior: "smooth" });
  };

  const scrollRight = () => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: stepPx, behavior: "smooth" });
  };

  // ✅ Drag با دست و ماوس (Pointer) + threshold که کلیک خراب نشه
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;
    const THRESHOLD = 6;

    const onDown = (e) => {
      // اگر روی لینک/دکمه کلیک شد، drag شروع نشه
      if (e.target.closest("button,a")) return;

      isDown = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.classList.add("cursor-grabbing");
    };

    const onMove = (e) => {
      if (!isDown) return;

      const dx = e.clientX - startX;

      if (!moved && Math.abs(dx) > THRESHOLD) moved = true;
      if (!moved) return;

      el.scrollLeft = startLeft - dx;
      e.preventDefault();
    };

    const onUp = () => {
      isDown = false;
      moved = false;
      el.classList.remove("cursor-grabbing");
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove, { passive: false });
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <section className="w-full md:py-10 py-0 mt-0 mb-8 relative md:mt-24 md:mb-26">
      <div className="w-full mx-auto px-4 relative">
        {/* Buttons */}
        <button
          onClick={scrollLeft}
          type="button"
          className="
            absolute left-2 top-1/2 -translate-y-1/2 
            z-20 w-10 h-10 rounded-full
            flex items-center justify-center
          "
          aria-label="scroll left"
        >
          <img src="./arrow-left.svg" className="w-5" alt="" />
        </button>

        <button
          onClick={scrollRight}
          type="button"
          className="
            absolute right-2 top-1/2 -translate-y-1/2 
            z-20 w-10 h-10 rounded-full
            flex items-center justify-center
          "
          aria-label="scroll right"
        >
          <img src="./arrow-right.svg" className="w-5" alt="" />
        </button>

        {/* SLIDER */}
        <div
          ref={sliderRef}
          className="
            flex items-center md:gap-16 gap-4 overflow-x-auto scroll-smooth
            scrollbar-hide py-4 justify-between p-12
            cursor-grab select-none
          "
          style={{ scrollbarWidth: "none" }}
        >
          {loopLogos.map((src, idx) => (
            <SponsorLogo key={`${src}-${idx}`} src={src} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SponsorLogo({ src }) {
  return (
    <div className="min-w-[120px] flex items-center justify-center">
      <img
        src={src}
        className="w-24 opacity-80 hover:opacity-100 transition"
        alt=""
        draggable={false}
      />
    </div>
  );
}
