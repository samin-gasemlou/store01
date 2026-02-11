import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import ar from "./locales/ar.json";
import ku from "./locales/ku.json";

const RTL_LANGS = ["ar", "ku"];

const applyDirection = (lang) => {
  const currentLang = lang?.split("-")[0] || "en";
  const isRTL = RTL_LANGS.includes(currentLang);

  document.documentElement.dir = isRTL ? "rtl" : "ltr";
  document.documentElement.lang = currentLang;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      ku: { translation: ku },
    },
    supportedLngs: ["en", "ar", "ku"],
    fallbackLng: "en",
    lng: localStorage.getItem("i18nextLng") || "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

// اعمال جهت اولیه
applyDirection(i18n.language);

// تغییر جهت هنگام تغییر زبان
i18n.on("languageChanged", (lng) => {
  applyDirection(lng);
});

export default i18n;
