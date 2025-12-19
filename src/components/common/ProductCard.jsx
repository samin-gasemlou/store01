import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProductCard({ id, title, img, price }) {
  const [liked, setLiked] = useState(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    return wishlist.some((item) => item.id === id);
  });

  const navigate = useNavigate();

  // حذف کاما و فاصله و تبدیل به عدد
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
    <Link to={`/product/${id}`} className="block">
      <div className="bg-white min-w-[250px] h-[330px] rounded-2xl relative p-4 shrink-0">
        {/* Heart icon */}
        <img
          onClick={toggleWishlist}
          src={liked ? "/heart-fill.svg" : "/heart.svg"}
          className="absolute top-4 left-4 w-5"
        />

        {/* Image */}
        <div className="w-full flex justify-center mt-4">
          <img src={img} className="h-40" />
        </div>

        {/* Title */}
        <p className="text-center mt-4 font-medium text-[17px]">{title}</p>

        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={addToCart}
            className="bg-[#EFEFEF] w-12 h-12 rounded-xl flex items-center justify-center"
          >
            <img src="/shopping-cart.svg" className="w-5 cursor-pointer" />
          </button>

          <p className="text-[#FF693B] text-[18px] font-semibold">
            {numericPrice.toLocaleString()} Toman
          </p>
        </div>
      </div>
    </Link>
  );
}
