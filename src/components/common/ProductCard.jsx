import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProductCard({ id, title, img, price }) {
  const [liked, setLiked] = useState(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    return wishlist.some((item) => item.id === id);
  });

  const navigate = useNavigate();

  const numericPrice = Number(String(price).replace(/[^0-9.-]+/g, "")) || 0;

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (liked) {
      wishlist = wishlist.filter((item) => item.id !== id);
    } else {
      wishlist.push({ id, title, img, price: numericPrice });
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setLiked(!liked);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.id === id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, title, img, price: numericPrice, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/cart");
  };

  return (
    <Link to={`/product/${id}`} className="block w-full">
      <div
        className="
          bg-white
          w-full
          h-[300px] sm:h-[318px] md:h-[328px]
          rounded-[10px]
          relative
          p-3 sm:p-4
          overflow-hidden
        "
      >
        <img
          onClick={toggleWishlist}
          src={liked ? "/heart-fill.svg" : "/heart.svg"}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 w-4 sm:w-5"
          alt=""
        />

        <div className="w-full flex justify-center mt-3 sm:mt-4">
          <img
            src={img}
            className="h-32 sm:h-36 md:h-40 object-contain"
            alt=""
          />
        </div>

        <p className="text-center mt-3 sm:mt-4 font-medium text-[13px] sm:text-[15px] md:text-[17px]">
          {title}
        </p>

        <div className="flex items-center justify-between mt-4 sm:mt-6">
          <button
            onClick={addToCart}
            className="
              bg-[#EFEFEF]
              w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12
              rounded-xl
              flex items-center justify-center
            "
          >
            <img
              src="/shopping-cart.svg"
              className="w-4 sm:w-[18px] md:w-5"
              alt=""
            />
          </button>

          <p className="text-[#2B4168] text-[13px] sm:text-[15px] md:text-[18px] font-semibold">
            {numericPrice.toLocaleString()} Toman
          </p>
        </div>
      </div>
    </Link>
  );
}
