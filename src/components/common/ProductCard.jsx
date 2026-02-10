import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProductCard({ id, title, img, price }) {
  const [liked, setLiked] = useState(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    return wishlist.some((item) => item.id === id);
  });

  const navigate = useNavigate();

  const numericPrice =
    Number(String(price).replace(/[^0-9.-]+/g, "")) || 0;

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
    <Link to={`/product/${id}`} className="block shrink-0">
      <div
        className="
          bg-white
          w-full md:w-[clamp(200px,48vw,230px)]
          h-[328px]
          rounded-[10px]
          relative
          p-4
          shrink-0
          overflow-hidden
        "
      >
        <img
          onClick={toggleWishlist}
          src={liked ? "/heart-fill.svg" : "/heart.svg"}
          className="absolute top-4 left-4 w-5"
          alt=""
        />

        <div className="w-full flex justify-center mt-4">
          <img src={img} className="h-40 object-contain" alt="" />
        </div>

        {/* 🔤 Title – responsive font */}
        <p className="text-center mt-4 font-medium text-[14px] sm:text-[16px] md:text-[17px]">
          {title}
        </p>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={addToCart}
            className="bg-[#EFEFEF] w-12 h-12 rounded-xl flex items-center justify-center"
          >
            <img src="/shopping-cart.svg" className="w-5" alt="" />
          </button>

          {/* 💰 Price – responsive font */}
          <p className="text-[#2B4168] text-[14px] sm:text-[16px] md:text-[18px] font-semibold">
            {numericPrice.toLocaleString()} Toman
          </p>
        </div>
      </div>
    </Link>
  );
}
