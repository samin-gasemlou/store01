import { useTranslation } from "react-i18next";

export default function MobileFooter() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-transparent md:hidden pt-24 pb-30 relative">
      <img src="/leaf.svg" className="absolute top-0 left-0" alt="" />

      {/* === Top Trapezoid / Capsule Shape === */}
      <div className="absolute md:-top-8 top-0 left-1/2 -translate-x-1/2 z-20">
        <div
          className="
            bg-transparent
            rounded-b-3xl
            px-16
            md:py-4 py-2
            text-center
            flex flex-col
            items-center
            border-0
            md:w-[200px]
            w-[195px]
          "
          style={{
            borderTopLeftRadius: "0",
            borderTopRightRadius: "0",
            clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)",
          }}
        >
          <img src="/s2.png" alt="" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 lg:px-4 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* LEFT */}
          <div>
            <p className="text-[15px] leading-6 text-gray-700">
              {t("footer.about")}
            </p>

            <div className="flex gap-4 mt-6">
              <img src="/whatsapp.svg" className="w-6 cursor-pointer" />
              <img src="/instagram.svg" className="w-6 cursor-pointer" />
              <img src="/telegram.svg" className="w-6 cursor-pointer" />
            </div>
          </div>

          {/* CENTER */}
          <div>
            <h3 className="text-[20px] font-semibold mb-4">
              {t("footer.quickAccess")}
            </h3>

            <ul className="space-y-2 text-[15px] text-gray-800">
              <li className="flex items-center gap-2">
                <span className="text-[#2B4168]">•</span> {t("footer.store")}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#2B4168]">•</span> {t("footer.blog")}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#2B4168]">•</span> {t("footer.contactUs")}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#2B4168]">•</span> {t("footer.aboutUs")}
              </li>
            </ul>
          </div>

          {/* RIGHT */}
          <div>
            <h3 className="text-[20px] font-semibold mb-4">
              {t("footer.contact")}
            </h3>

            <div className="flex flex-col gap-3 text-[15px] text-gray-800">
              <div className="flex items-center gap-2">
                <img src="/call-calling.svg" className="w-5" /> 0913333333
              </div>

              <div className="flex items-center gap-2">
                <img src="/messages.svg" className="w-5" /> test@gmail.com
              </div>

              <div className="flex items-center gap-2">
                <img src="/location.svg" className="w-5" />
                {t("footer.address")}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-[#F2F3F5] my-10"></div>

        <p className="text-center text-[#444444] text-[15px]">
          {t("footer.concept")}{" "}
          <span className="text-[#2B4168]"> Amirhosein Ghavidel </span>
        </p>
      </div>
    </footer>
  );
}
