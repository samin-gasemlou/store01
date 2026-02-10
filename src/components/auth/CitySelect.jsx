import { ChevronDown, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CitySelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          w-full
          bg-[#ECECEC]
          rounded-[14px]
          px-6
          py-5
          text-[18px]
          flex
          items-center
          justify-between
        "
      >
        <span className={`${value ? "text-black" : "text-black"}`}>
          {value || "City"}
        </span>
        <ChevronDown size={22} />
      </button>

      <div
        className={`
          absolute
          left-0
          right-0
          mt-3
          rounded-[14px]
          border
          border-white/80
          bg-[#5A5A5A]
          shadow-2xl
          overflow-hidden
          transition-all
          duration-200
          ${open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
        `}
      >
        <div className="max-h-[360px] overflow-y-auto py-2">
          {options.map((opt) => {
            const active = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="
                  w-full
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  text-left
                  text-white
                  text-[16px]
                "
              >
                <span className="w-5 flex justify-center">
                  {active ? <Check size={18} /> : null}
                </span>
                <span className={`${active ? "font-medium" : "font-normal"}`}>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
