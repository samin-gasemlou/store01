import { useEffect, useRef, useState } from "react";
import { sliderData } from "./sliderData";

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  // ✅ برای ESLint باید state باشه (نه ref در render)
  const [dragging, setDragging] = useState(false);

  const trackRef = useRef(null);

  // drag refs (فقط برای نگهداری مقادیر)
  const startXRef = useRef(0);
  const isDownRef = useRef(false);

  const goTo = (i) => {
    const len = sliderData.length;
    setActive((i + len) % len);
  };

  const nextSlide = () => goTo(active + 1);
  const prevSlide = () => goTo(active - 1);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onDragStart = (e) => e.preventDefault();
    el.addEventListener("dragstart", onDragStart);
    return () => el.removeEventListener("dragstart", onDragStart);
  }, []);

  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    isDownRef.current = true;
    setDragging(true);
    startXRef.current = e.clientX;

    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerUp = (e) => {
    if (!isDownRef.current) return;

    isDownRef.current = false;
    setDragging(false);

    const dx = e.clientX - startXRef.current;
    const threshold = 45;

    if (Math.abs(dx) < threshold) return;

    if (dx < 0) nextSlide();
    else prevSlide();
  };

  return (
    <div className="w-full md:mt-16 mt-20 px-1 sm:px-4 z-50 md:z-40">
      <div
        className="
          relative isolate
          mx-auto
          w-full
          h-[200px]
          sm:h-[280px]
          md:h-[340px]
          lg:h-[400px]
          overflow-hidden
          rounded-[10px]
          md:rounded-2xl
          bg-black
          touch-pan-y
        "
      >
        {/* ✅ Track */}
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="absolute inset-0 flex h-full w-full"
          style={{
            transform: `translateX(-${active * 100}%)`,
            transition: dragging ? "none" : "transform 450ms ease",
          }}
        >
          {sliderData.map((item) => (
            <div key={item.id} className="w-full h-full shrink-0">
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-60
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
          className="absolute right-4 top-1/2 -translate-y-1/2 z-60
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
              bg-[#f2f3f5]
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
