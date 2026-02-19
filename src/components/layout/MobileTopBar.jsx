import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MobileTopBar() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const selectLang = (value) => {
    i18n.changeLanguage(value);
    setOpen(false);
  };

  const lang = (i18n.language || "en").split("-")[0];
  const currentLang = lang.toUpperCase();

  const isRTL = lang === "ar" || lang === "ku";

  // ✅ متن‌ها بر اساس زبان فعال
  const languageLabels = {
    en: {
      en: "English",
      ar: "Arabic",
      ku: "Kurdish",
    },
    ar: {
      en: "English",
      ar: "العربية",
      ku: "الكردية",
    },
    ku: {
      en: "ئینگلیزی",
      ar: "عەرەبی",
      ku: "کوردی",
    },
  };

  const labels = languageLabels[lang] || languageLabels.en;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="md:hidden  w-[95%] mx-auto rounded-[10px] bg-white shadow-[0px_-60px_50px_50px_rgba(0,0,0,0.15)] relative z-50"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 text-sm text-gray-700 font-bold"
          >
            {currentLang} <ChevronDown size={16} />
          </button>

          <div
            className={`
              absolute ${isRTL ? "right-0" : "left-0"} top-4.5
              bg-white shadow-lg rounded-md py-1 w-55
              transition-all duration-200 ease-out flex flex-row items-center justify-center
              ${
                open
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2 pointer-events-none"
              }
            `}
          >
            <button
              onClick={() => selectLang("en")}
              className={`block w-full px-4 py-2 hover:bg-gray-50 text-sm ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {labels.en}
            </button>

            <button
              onClick={() => selectLang("ar")}
              className={`block w-full px-4 py-2 hover:bg-gray-50 text-sm ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {labels.ar}
            </button>

            <button
              onClick={() => selectLang("ku")}
              className={`block w-full px-4 py-2 hover:bg-gray-50 text-sm ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {labels.ku}
            </button>
          </div>
        </div>

        <Link to="/">
          <h1 className="font-bold text-[#2B4168]">01 STORE</h1>
        </Link>
      </div>
    </div>
  );
}
