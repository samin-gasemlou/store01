import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";

export default function Cart() {
  // مقدار اولیه از localStorage گرفته می‌شود
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const shippingMethods = [
    { id: 1, title: "Chapaar (Recommended)", price: 0 },
    { id: 2, title: "Post", price: 85000 },
    { id: 3, title: "Tipax", price: 120000 },
    { id: 4, title: "Cargo", price: 150000 },
    { id: 5, title: "Bus Delivery", price: 100000 },
  ];

  const [shipping, setShipping] = useState(shippingMethods[0]);

  useEffect(() => {
    // فقط listener اضافه می‌کنیم
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(updatedCart);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []); // هیچ setState ای مستقیماً داخل effect نیست

  const updateQty = (id, type) => {
    const updated = cartItems.map((item) =>
      item.id === id
        ? { ...item, qty: type === "inc" ? item.qty + 1 : Math.max(1, item.qty - 1) }
        : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + shipping.price;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Navbar />
      <section className="w-full px-4 md:px-10 pb-10 mb-24 md:mt-2">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* CART ITEMS */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6">
            <div className="hidden md:grid grid-cols-5 text-sm text-gray-500 mb-4">
              <span className="col-span-2">Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 border-t py-6">
                {/* PRODUCT */}
                <div className="flex items-center gap-4 md:col-span-2">
                  <img src={item.img} className="w-20 h-20 object-cover rounded-xl" />
                  <p className="text-sm font-medium">{item.title}</p>
                </div>

                {/* PRICE */}
                <p className="text-sm text-gray-700">{item.price.toLocaleString()} Toman</p>

                {/* QTY */}
                <div className="flex items-center border rounded-lg w-fit">
                  <button onClick={() => updateQty(item.id, "inc")} className="px-3 py-1">+</button>
                  <span className="px-4">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, "dec")} className="px-3 py-1">-</button>
                </div>

                {/* TOTAL */}
                <div className="flex items-center justify-between">
                  <span className="text-[#2B4168] font-medium">{(item.price * item.qty).toLocaleString()} Toman</span>
                  <button onClick={() => removeItem(item.id)} className="text-gray-400 text-xl">×</button>
                </div>
              </div>
            ))}

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-4 mt-6">
              <input placeholder="Discount code" className="border rounded-lg px-4 py-2 text-sm" />
              <button className="bg-[#2b41682a] px-6 py-2 rounded-lg text-sm">Apply Coupon</button>
              <button className="bg-[#2b41682a] px-6 py-2 rounded-lg text-sm">Update Cart</button>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded-2xl p-6 h-fit">
            <h3 className="font-semibold mb-4">Cart Totals</h3>

            <div className="flex justify-between text-sm mb-4">
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString()} Toman</span>
            </div>

            {/* SHIPPING */}
            <div className="space-y-3 mb-4">
              {shippingMethods.map((method) => (
                <label key={method.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" checked={shipping.id === method.id} onChange={() => setShipping(method)} />
                  {method.title}
                  {method.price > 0 && <span className="text-[#2B4168]">{method.price.toLocaleString()} Toman</span>}
                </label>
              ))}
            </div>

            <div className="flex justify-between font-semibold mb-6">
              <span>Total</span>
              <span className="text-[#2B4168]">{total.toLocaleString()} Toman</span>
            </div>

            <Link to={"/checkout"}>
              <button className="w-full bg-[#2b41682a] py-3 rounded-lg font-medium">Proceed to Checkout</button>
            </Link>
          </div>

        </div>
      </section>
      <Footer />
    </div>
  );
}
