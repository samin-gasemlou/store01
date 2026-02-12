import { useTranslation } from "react-i18next";

export default function BannerSection() {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.dir() === "rtl";

  return (
    <section className="w-full relative md:mt-24 md:mb-26 mt-8 mb-0">
      <div
        className="
        w-full h-full 
        flex flex-col md:flex-row 
        items-center md:items-start 
        justify-between 
        relative
      "
      >
        {/* LEFT IMAGE + BG BOX */}
        <div
          className="
          relative 
          w-full md:w-1/2 
          flex justify-center md:justify-start 
          mt-20 md:mt-0
        "
        >
          {/* BG Orange */}
          <div
            className={`
              absolute bg-[#2B4168]
              md:w-full  w-[350px] h-[230px]
              top-10
              z-10 md:block
              ${isRTL ? "right-80 md:right-20 translate-x-1/2 rounded-bl-3xl rounded-tl-3xl"
                       : "left-0 rounded-br-3xl rounded-tr-3xl"}
            `}
          ></div>

          {/* Main Image */}
          <img
            src="./insta.svg"
            alt="Perfume"
            className="
              w-[320px] object-contain 
              absolute 
              -top-14 md:-top-14 
              right-1/2 md:right-28 z-10
              translate-x-1/2 md:translate-x-0
            "
          />
        </div>

        {/* RIGHT TEXT */}
        <div
          className="
          w-full md:w-1/2 
          h-[200px] 
          flex flex-col items-center
          justify-center 
          mt-80 md:mt-16
          relative 
        "
        >
          <img src="/s.png" alt="" className="w-[190px]" />

          <p className="text-gray-600 md:hidden mt-4 text-sm sm:text-base text-center md:text-left">
            {t("home.followUs")}
          </p>
        </div>
      </div>
    </section>
  );
}
