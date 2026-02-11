import { useState } from "react";
import ProductReviews from "../singleProduct/ProductReviews";
import { useTranslation } from "react-i18next";

export default function ProductTabs({ product }) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("desc");

  const lang = (i18n.language || "en").split("-")[0];
  const isRTL = lang === "ar" || lang === "ku";

  const productId = String(product?.id ?? "");
  const desc = t(`products.${productId}.description`, product?.description);

  if (!product) return null;

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full mx-auto md:px-4 mt-16 mb-4"
    >
      <div className="flex md:flex-wrap gap-3 w-full">
        <TabButton active={activeTab === "desc"} onClick={() => setActiveTab("desc")}>
          {t("single.tabs.description")}
        </TabButton>

        <TabButton active={activeTab === "specs"} onClick={() => setActiveTab("specs")}>
          {t("single.tabs.specifications")}
        </TabButton>

        <TabButton active={activeTab === "reviews"} onClick={() => setActiveTab("reviews")}>
          {t("single.tabs.reviews")}
        </TabButton>
      </div>

      {/* ✅ اینجا بوردر ردیوس بر اساس RTL تغییر می‌کند */}
      <div
        className={`
          bg-white
          ${isRTL ? "rounded-tl-3xl" : "rounded-tr-3xl"}
          rounded-bl-3xl
          rounded-br-3xl
          p-6 sm:p-10 w-full
        `}
      >
        {activeTab === "desc" && (
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base w-full">
            {desc}
          </p>
        )}

        {activeTab === "specs" && (
          <>
            <h3 className="text-xl font-semibold mb-6">
              {t("single.tabs.specTitle")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 text-sm sm:text-base">
              <SpecRow label={t("single.specs.notes")} value={t("single.specs.notesValue")} />
              <SpecRow label={t("single.specs.longevity")} value={t("single.specs.longevityValue")} />
              <SpecRow label={t("single.specs.projection")} value={t("single.specs.projectionValue")} />
              <SpecRow label={t("single.specs.season")} value={t("single.specs.seasonValue")} />
            </div>
          </>
        )}

        {activeTab === "reviews" && <ProductReviews />}
      </div>
    </section>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        md:px-6 px-2 py-2 md:py-3 md:w-[190px]
        rounded-t-xl md:text-sm text-[14px] sm:text-base border
        transition
        ${
          active
            ? "bg-[#2B4168] text-white border-[#2B4168]"
            : "bg-transparent text-[#2B4168] border-[#2B4168] hover:bg-[#2b416838]"
        }
      `}
      type="button"
    >
      {children}
    </button>
  );
}

function SpecRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-6 border-b border-gray-100 pb-4">
      <span className="font-medium w-48">{label}</span>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}
