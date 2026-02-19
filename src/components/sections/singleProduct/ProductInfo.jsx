import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function pickByLang(product, lang) {
  // title
  const title =
    product?.title ??
    product?.name_fa ??
    product?.name_en ??
    product?.name ??
    "";

  // descriptions (based on your backend fields)
  const desc_en = product?.description_en ?? "";
  const desc_ar = product?.description_ar ?? "";
  const desc_ku = product?.description_kur ?? product?.description_ku ?? "";

  let description = "";
  if (lang === "en") description = desc_en || desc_ar || desc_ku || product?.description || "";
  else if (lang === "ar") description = desc_ar || desc_en || desc_ku || product?.description || "";
  else if (lang === "ku") description = desc_ku || desc_ar || desc_en || product?.description || "";
  else description = desc_en || desc_ar || desc_ku || product?.description || "";

  // price
  const priceNumber =
    Number(product?.price ?? product?.salePrice ?? product?.finalPrice ?? 0) || 0;

  return { title, description, priceNumber };
}

export default function ProductInfo({ product }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [size, setSize] = useState("90 ml");
  const [qty, setQty] = useState(1);

  const lang = (i18n.language || "en").split("-")[0];

  // ✅ برای سازگاری با کد قبلی (اگر جایی product.id بود)
  const productId = String(product?._id ?? product?.id ?? "");

  // ✅ ترجمه فقط اگر کلید واقعاً وجود داشت، وگرنه از دیتای بک
  const tr = useMemo(() => {
    const { title, description, priceNumber } = pickByLang(product, lang);

    const keyTitle = `products.${productId}.title`;
    const keyDesc = `products.${productId}.description`;
    const keyPrice = `products.${productId}.price`;

    const titleMaybe = t(keyTitle, { defaultValue: "" });
    const descMaybe = t(keyDesc, { defaultValue: "" });
    const priceMaybe = t(keyPrice, { defaultValue: "" });

    return {
      title: titleMaybe && titleMaybe !== keyTitle ? titleMaybe : title,
      description: descMaybe && descMaybe !== keyDesc ? descMaybe : description,
      // قیمت ترجمه‌ای نداریم برای آیتم‌های بک؛ پس عدد واقعی رو نمایش می‌دیم
      price:
        priceMaybe && priceMaybe !== keyPrice
          ? priceMaybe
          : `${priceNumber.toLocaleString()} Toman`,
      _priceNumber: priceNumber, // داخلی برای سبد خرید
    };
  }, [t, productId, product, lang]);

  const numericPrice = tr._priceNumber || 0;

  const addToCart = () => {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      cart = [];
    }

    const pid = String(product?._id ?? product?.id ?? "");
    const existing = cart.find((item) => String(item.id) === pid);

    const img =
      product?.img ??
      product?.mainImage ??
      (Array.isArray(product?.images) ? product.images[0] : "") ??
      "";

    if (existing) existing.qty += qty;
    else {
      cart.push({
        id: pid,
        title: tr.title,
        img,
        price: numericPrice,
        qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const buyNow = () => {
    addToCart();
    navigate("/checkout");
  };

  return (
    <div className="w-full flex flex-col items-start gap-3 md:gap-4">
      <h1
        className="
          w-full
          text-left
          font-semibold
          text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px]
          leading-snug
        "
      >
        {tr.title}
      </h1>

      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <img src="/star.svg" className="w-4 sm:w-[18px]" alt="" />
          <img src="/star.svg" className="w-4 sm:w-[18px]" alt="" />
          <img src="/star.svg" className="w-4 sm:w-[18px]" alt="" />
          <img src="/star.svg" className="w-4 sm:w-[18px]" alt="" />
          <img src="/star.svg" className="w-4 sm:w-[18px]" alt="" />
        </div>

        <span className="text-gray-500 text-[12px] sm:text-[13px] md:text-sm">
          {t("single.reviews", { count: product?.reviewsCount || 13 })}
        </span>
      </div>

      <p className="text-gray-500 text-[12px] sm:text-[13px] md:text-sm">
        {t("single.productCode")}: {product?.code || product?.sku || "-"}
      </p>

      <div
        className="
          w-full
          bg-white
          rounded-2xl
          shadow-sm
          border border-gray-100
          p-3 sm:p-4 md:p-5
        "
      >
        <p className="text-gray-600 text-[12px] sm:text-[14px] md:text-[15px] leading-6 text-justify">
          {tr.description}
        </p>
      </div>

      <div className="w-full flex items-center justify-center md:items-end gap-3 sm:gap-4 mt-1">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[12px] sm:text-[13px] md:text-sm">
            {t("single.qty")}:
          </label>

          <div
            className="
              flex items-center justify-between
              h-9 sm:h-10 md:h-11
              w-[110px] sm:w-[130px]
              border border-[#1C1E1F]
              rounded-xl
              px-2
              select-none
            "
          >
            <button
              type="button"
              onClick={() => qty > 1 && setQty(qty - 1)}
              className="px-2 text-[18px] sm:text-[20px] leading-none"
              aria-label={t("single.dec")}
            >
              −
            </button>

            <span className="text-[12px] sm:text-[13px] md:text-sm font-semibold">
              {qty}
            </span>

            <button
              type="button"
              onClick={() => setQty(qty + 1)}
              className="px-2 text-[18px] sm:text-[20px] leading-none"
              aria-label={t("single.inc")}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-[12px] sm:text-[13px] md:text-sm">
            {t("single.size")}:
          </label>

          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="
              h-9 sm:h-10 md:h-11
              w-[110px] sm:w-[130px]
              border border-[#1C1E1F]
              rounded-xl
              text-[12px] sm:text-[13px] md:text-sm
              px-2
              bg-white
              outline-none
            "
          >
            <option value="50 Mil">{t("single.sizeOptions.50")}</option>
            <option value="90 Mil">{t("single.sizeOptions.90")}</option>
            <option value="120 Mil">{t("single.sizeOptions.120")}</option>
          </select>
        </div>
      </div>

      <p className="mt-2 text-[#2B4168] text-center w-full font-semibold text-[18px] sm:text-[20px] md:text-[24px]">
        {tr.price}
      </p>

      <div className="w-full flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => {
            addToCart();
            alert(t("single.addedToCart"));
          }}
          type="button"
          className="
            flex-1
            h-10 sm:h-11 md:h-12
            rounded-xl
            bg-[#2B4168]
            text-white
            text-[12px] sm:text-[14px] md:text-[15px]
            font-semibold
            whitespace-nowrap
            md:px-3 px-2
            hover:brightness-95
            transition
            min-w-0
          "
        >
          {t("single.addToCart")}
        </button>

        <button
          onClick={buyNow}
          type="button"
          className="
            flex-1
            h-10 sm:h-11 md:h-12
            rounded-xl
            border border-gray-800
            text-[12px] sm:text-[14px] md:text-[15px]
            font-semibold
            whitespace-nowrap
            md:px-3 px-2
            hover:bg-gray-100
            transition
            min-w-0
          "
        >
          {t("single.buyNow")}
        </button>
      </div>

      <div className="w-full mt-6 sm:mt-8 grid grid-cols-3 gap-3 sm:gap-5">
        <Feature icon="/truck-fast.svg" label={t("single.features.fastShipping")} />
        <Feature icon="/medal-star.svg" label={t("single.features.quality")} />
        <Feature icon="/headphone.svg" label={t("single.features.support")} />
      </div>
    </div>
  );
}

function Feature({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div
        className="
          w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
          rounded-full
          border border-[#2B4168]
          grid place-items-center
        "
      >
        <img src={icon} className="w-5 sm:w-6 md:w-7" alt="" draggable={false} />
      </div>

      <p className="text-[11px] sm:text-[12px] md:text-[13px] text-gray-700">
        {label}
      </p>
    </div>
  );
}
