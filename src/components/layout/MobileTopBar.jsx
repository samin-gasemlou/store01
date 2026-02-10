import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function MobileTopBar() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("EN");

  const selectLang = (value) => {
    setLang(value);
    setOpen(false);
  };

  return (
    <div className="md:hidden w-[95%] mx-auto rounded-[10px] bg-white shadow-[0px_-60px_50px_50px_rgba(0,0,0,0.15)] relative z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Language */}
        <div className="relative ">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 text-sm text-gray-700 font-bold"
          >
            {lang} <ChevronDown size={16} />
          </button>

          <div
            className={`
              absolute left-0 top-3.5  bg-white shadow-lg rounded-md py-1  w-44
              transition-all duration-200 ease-out flex flex-row items-center justify-center
              ${open
                ? "opacity-100 visible translate-y-0 "
                : "opacity-0 invisible -translate-y-2 pointer-events-none"}
            `}
          >
            <button
              onClick={() => selectLang("FA")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
            >
              Persian
            </button>
            <button
              onClick={() => selectLang("CUR")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
            >
              Cur
            </button>
            <button
              onClick={() => selectLang("AR")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
            >
              Ar
            </button>
          </div>
        </div>

        {/* Logo */}
        <h1 className="font-bold text-[#2B4168]">01 STORE</h1>
      </div>
    </div>
  );
}
