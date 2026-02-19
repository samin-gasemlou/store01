import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

const LANGS = [
  { code: "en", short: "EN" },
  { code: "ku", short: "KU" },
  { code: "ar", short: "AR" },
];

export default function LanguageSwitch({ className = "", align = "left" }) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const lang = (i18n.language || "en").split("-")[0];
  const isRTL = lang === "ar" || lang === "ku";

  const currentShort = useMemo(() => {
    const found = LANGS.find((l) => l.code === lang);
    return found?.short || "EN";
  }, [lang]);

  useEffect(() => {
    const onDoc = () => setOpen(false);
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  const finalAlign = isRTL ? "right" : align;

  return (
    <div
      className={`relative ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        setOpen((v) => !v);
      }}
    >
      <button
        type="button"
        className="flex items-center gap-1 text-sm text-gray-700 font-bold"
      >
        {currentShort} <ChevronDown size={16} />
      </button>

      <div
        className={`
          absolute top-7 ${finalAlign === "right" ? "right-0" : "left-0"}
          bg-white shadow-lg rounded-md py-2 w-40
          transition-all duration-200 origin-top
          ${open ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95 pointer-events-none"}
        `}
      >
        <button
          type="button"
          onClick={() => changeLang("en")}
          className={`block w-full px-4 py-2 hover:bg-gray-50 text-sm ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("lang.en")}
        </button>

        <button
          type="button"
          onClick={() => changeLang("ar")}
          className={`block w-full px-4 py-2 hover:bg-gray-50 text-sm ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("lang.ar")}
        </button>

        <button
          type="button"
          onClick={() => changeLang("ku")}
          className={`block w-full px-4 py-2 hover:bg-gray-50 text-sm ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("lang.ku")}
        </button>
      </div>
    </div>
  );
}
