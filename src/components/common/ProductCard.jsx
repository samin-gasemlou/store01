import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_BASE =
  import.meta.env?.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:4000/api/v1";

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE).origin;
  } catch {
    return "http://localhost:4000";
  }
})();

function fixImageUrl(src) {
  const s = (src ?? "").toString().trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/uploads/")) return `${API_ORIGIN}${s}`; // ✅ مهم
  return s;
}

export default function ProductCard({ id, title, img, price }) {
  const safeId = id ?? "";
  const safeTitle = title ?? "";
  const safeImg = fixImageUrl(img);
  const safePriceRaw = price ?? 0;

  const [liked, setLiked] = useState(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    return wishlist.some((item) => String(item.id) === String(safeId));
  });

  const navigate = useNavigate();

  const numericPrice =
    Number(String(safePriceRaw).replace(/[^0-9.-]+/g, "")) || 0;

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (liked) {
      wishlist = wishlist.filter((item) => String(item.id) !== String(safeId));
    } else {
      wishlist.push({
        id: safeId,
        title: safeTitle,
        img: safeImg,
        price: numericPrice,
      });
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setLiked(!liked);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => String(item.id) === String(safeId));

    if (existing) existing.qty += 1;
    else
      cart.push({
        id: safeId,
        title: safeTitle,
        img: safeImg,
        price: numericPrice,
        qty: 1,
      });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/cart");
  };

  return (
    <Link to={safeId ? `/product/${safeId}` : "#"} className="block w-full">
      <div
        className="
          bg-white
          w-full h-[290px]
          aspect-4/5
          md:h-[280px]
          lg:h-[340px]
          rounded-[10px]
          relative
          p-3 sm:p-4 lg:p-5
          overflow-hidden
          flex flex-col items-center justify-center
        "
      >
        <button
          onClick={toggleWishlist}
          type="button"
          className="
            absolute z-10
            top-3 left-3
            sm:top-4 sm:left-4
            grid place-items-center
            w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
            rounded-full
            bg-white/80 backdrop-blur
            hover:bg-white
          "
          aria-label="toggle wishlist"
        >
          <img
            src={liked ? "/heart-fill.svg" : "/heart.svg"}
            className="w-4 sm:w-[18px] md:w-5"
            alt=""
            draggable={false}
          />
        </button>

        <div className="flex-1 flex items-center justify-center pt-6 sm:pt-7 md:pt-8">
          {safeImg ? (
            <img
              src={safeImg}
              alt=""
              draggable={false}
              className="
                w-auto
                max-w-[85%]
                max-h-[55%]
                sm:max-h-[60%]
                md:max-h-[72%]
                lg:max-h-[75%]
                object-contain
              "
            />
          ) : null}
        </div>

        <p
          className="
            mt-2 sm:mt-3
            w-full
            text-center font-bold
            text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px]
            leading-5
            whitespace-nowrap overflow-hidden text-ellipsis
          "
          title={safeTitle}
        >
          {safeTitle}
        </p>

        <div className="mt-3 sm:mt-4 flex items-center justify-between w-full">
          <button
            onClick={addToCart}
            type="button"
            className="
              bg-[#EFEFEF]
              w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12
              rounded-xl
              flex items-center justify-center
              hover:brightness-95
            "
            aria-label="add to cart"
          >
            <img
              src="/shopping-cart.svg"
              className="w-4 sm:w-[18px] md:w-5"
              alt=""
              draggable={false}
            />
          </button>

          <p className="text-[#2B4168] text-[11px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-bold whitespace-nowrap">
            {numericPrice.toLocaleString()} Toman
          </p>
        </div>
      </div>
    </Link>
  );
}
