import { useState } from "react";

export default function ProductInfo({ product }) {
  const [size, setSize] = useState("90 ml");
  const [qty, setQty] = useState(1);

   // تابع اضافه کردن محصول به سبد خرید
  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        img: product.img,
        price: Number(String(product.price).replace(/[^0-9.-]+/g, "")) || 0,
        qty: 1
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert("Product added to cart");
  };


  return (
    <div className="w-full flex flex-col items-center md:items-start justify-center gap-2">

      {/* TITLE */}
      <h1 className="text-3xl sm:text-4xl font-semibold text-center px-4 md:px-0">
        {product.title}
      </h1>

      {/* RATING */}
      <div className="flex items-center gap-2 text-sm">
        <div className="flex gap-1">
          <img src="/star.svg" alt="" />
          <img src="/star.svg" alt="" />
          <img src="/star.svg" alt="" />
          <img src="/star.svg" alt="" />
          <img src="/star.svg" alt="" />
        </div>
        <span className="text-gray-500">
          Reviews ({product.reviewsCount || 13})
        </span>
      </div>

      {/* PRODUCT CODE */}
      <p className="text-sm text-gray-500">
        Product Code: {product.code}
      </p>

      {/* DESCRIPTION */}
      <p className="text-gray-600 leading-relaxed text-sm sm:text-base max-w-xl text-justify md:p-2 p-6">
        {product.description}
      </p>

    {/* QTY */}
      <div className="flex md:flex-col gap-2">
        <label className="font-medium">Qty:</label>

        <div className="flex items-center h-[29px] border border-[#1C1E1F] rounded-lg w-[81px] justify-between px-2 py-1">
          <button
            onClick={() => qty > 1 && setQty(qty - 1)}
            className="text-lg px-2"
          >
            −
          </button>

          <span className="text-sm">{qty}</span>

          <button
            onClick={() => setQty(qty + 1)}
            className="text-lg px-2"
          >
            +
          </button>
        </div>
      </div>
    {/* SIZE */}
      <div className="flex md:flex-col gap-2">
        <label className="font-medium">Size:</label>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-[81px] h-[29px] border border-[#1C1E1F] rounded-lg text-sm"
        >
          <option>50 Mil</option>
          <option>90 Mil</option>
          <option>120 Mil</option>
        </select>
      </div>





      {/* PRICE */}
      <p className="text-2xl font-semibold text-[#2B4168]">
        {product.price}
      </p>

      {/* BUTTONS */}
      <div className="flex flex-row gap-4 mt-2">
        <button onClick={addToCart} className="bg-[#2B4168] text-white md:py-4 py-2 px-8 rounded-lg text-sm sm:text-base hover:bg-[#2B4168] transition w-[90%] md:w-[303px]">
          ADD TO CART
        </button>

        <button className="border border-gray-800 md:py-4 py-2 px-8 rounded-lg text-sm sm:text-base hover:bg-gray-100 transition w-[90%] md:w-[303px]">
          BUY NOW
        </button>
      </div>

      {/* FEATURES */}
      <div className="flex items-center justify-center gap-6 mt-10 text-center text-sm">
        <div className="flex items-center justify-center md:flex-row flex-col gap-2">
          <div className="w-12 h-12 rounded-full border border-[#2B4168] flex items-center justify-center text-[#2B4168]">
            <img src="/truck-fast.svg" alt="" />
          </div>
          <p>Fast shipping</p>
        </div>

        <div className="flex items-center justify-center md:flex-row flex-col gap-2">
          <div className="w-12 h-12 rounded-full border border-[#2B4168] flex items-center justify-center text-[#2B4168]">
            <img src="/medal-star.svg" alt="" />
          </div>
          <p>Quality assurance</p>
        </div>

        <div className="flex items-center justify-center md:flex-row flex-col gap-2">
          <div className="w-12 h-12 rounded-full border border-[#2B4168] flex items-center justify-center text-[#2B4168]">
            <img src="/headphone.svg" alt="" />
          </div>
          <p>Online support</p>
        </div>
      </div>

    </div>
  );
}
