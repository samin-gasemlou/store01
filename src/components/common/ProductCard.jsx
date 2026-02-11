import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProductCard({ id, title, img, price }) {
  const safeId = id ?? "";
  const safeTitle = title ?? "";
  const safeImg = img ?? "";
  const safePriceRaw = price ?? 0;

  const [liked, setLiked] = useState(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    return wishlist.some((item) => item.id === safeId);
  });

  const navigate = useNavigate();

  const numericPrice =
    Number(String(safePriceRaw).replace(/[^0-9.-]+/g, "")) || 0;

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (liked) {
      wishlist = wishlist.filter((item) => item.id !== safeId);
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
    const existing = cart.find((item) => item.id === safeId);

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
          w-full h-[220px]
          aspect-[4/5]
          md:h-[280px]
          lg:h-[340px]
          rounded-[10px]
          relative
          p-3 sm:p-4 lg:p-5
          overflow-hidden
          flex flex-col items-center justify-center
        "
      >
        {/* ❤️ Heart */}
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

        {/* 🖼️ Image area: flexible + حرفه‌ای */}
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

        {/* 🏷️ Title: کنترل طول + 2 خط */}
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

        {/* 🧾 Bottom: همیشه پایین، فاصله‌ها اصولی */}
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
