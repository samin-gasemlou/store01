import { useState } from "react";

export default function ProductInfo({ product }) {
  const [size, setSize] = useState("90 ml");
  const [qty, setQty] = useState(1);

  const numericPrice =
    Number(String(product?.price ?? 0).replace(/[^0-9.-]+/g, "")) || 0;

  const addToCart = () => {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      cart = [];
    }

    const existing = cart.find((item) => String(item.id) === String(product.id));

    if (existing) existing.qty += qty;
    else {
      cart.push({
        id: product.id,
        title: product.title,
        img: product.img,
        price: numericPrice,
        qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert("Product added to cart");
  };

  return (
    <div className="w-full flex flex-col items-start gap-3 md:gap-4">
      {/* ✅ TITLE */}
      <h1
        className="
          w-full
          text-left
          font-semibold
          text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px]
          leading-snug
        "
      >
        {product.title}
      </h1>

      {/* ✅ RATING */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <img src="/star.svg" className="w-4 sm:w-[18px]" alt="" />
          <img src="/star.svg" className="w-4 sm:w-[18px]" alt="" />
          <img src="/star.svg" className="w-4 sm:w-[18px]" alt="" />
          <img src="/star.svg" className="w-4 sm:w-[18px]" alt="" />
          <img src="/star.svg" className="w-4 sm:w-[18px]" alt="" />
        </div>

        <span className="text-gray-500 text-[12px] sm:text-[13px] md:text-sm">
          Reviews ({product.reviewsCount || 13})
        </span>
      </div>

      {/* ✅ PRODUCT CODE */}
      <p className="text-gray-500 text-[12px] sm:text-[13px] md:text-sm">
        Product Code: {product.code}
      </p>

      {/* ✅ DESCRIPTION (باکس‌دار و ریسپانسیو) */}
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
          {product.description}
        </p>
      </div>

      {/* ✅ QTY + SIZE (کاملاً کنار هم تو موبایل، ریسپانسیو) */}
      <div className="w-full flex items-center justify-center md:items-end gap-3 sm:gap-4 mt-1">
        {/* QTY */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[12px] sm:text-[13px] md:text-sm">
            Qty:
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
              aria-label="decrease"
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
              aria-label="increase"
            >
              +
            </button>
          </div>
        </div>

        {/* SIZE */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[12px] sm:text-[13px] md:text-sm">
            Size:
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
            <option>50 Mil</option>
            <option>90 Mil</option>
            <option>120 Mil</option>
          </select>
        </div>
      </div>

      {/* ✅ PRICE */}
      <p className="mt-2 text-[#2B4168] text-center w-full font-semibold text-[18px] sm:text-[20px] md:text-[24px]">
        {product.price}
      </p>

      {/* ✅ BUTTONS (هم‌ردیف، ریسپانسیو، دو ردیفه نشه) */}
      <div className="w-full  flex items-center gap-2 sm:gap-3">
        <button
          onClick={addToCart}
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
          ADD TO CART
        </button>

        <button
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
          BUY NOW
        </button>
      </div>

      {/* ✅ FEATURES (ریسپانسیو و جمع‌وجور) */}
      <div className="w-full mt-6 sm:mt-8 grid grid-cols-3 gap-3 sm:gap-5">
        <Feature icon="/truck-fast.svg" label="Fast shipping" />
        <Feature icon="/medal-star.svg" label="Quality assurance" />
        <Feature icon="/headphone.svg" label="Online support" />
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
