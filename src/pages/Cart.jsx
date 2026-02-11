import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const { t } = useTranslation();

  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  // ✅ key ثابت برای ترجمه
  const shippingMethods = [
    { id: 1, key: "chapaar", price: 0 },
    { id: 2, key: "post", price: 85000 },
    { id: 3, key: "tipax", price: 120000 },
    { id: 4, key: "cargo", price: 150000 },
    { id: 5, key: "bus", price: 100000 },
  ];

  const [shipping, setShipping] = useState(shippingMethods[0]);

  useEffect(() => {
    const handleCartUpdate = () => {
      try {
        const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(updatedCart);
      } catch {
        setCartItems([]);
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const updateQty = (id, type) => {
    const updated = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            qty:
              type === "inc" ? item.qty + 1 : Math.max(1, item.qty - 1),
          }
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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const total = subtotal + shipping.price;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Navbar />

      <section className="w-full px-2 md:px-10 pb-10 mb-24 md:mt-10 mt-20">
        <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6">
            <div className="hidden md:grid grid-cols-5 text-sm text-gray-500 mb-4">
              <span className="col-span-2">{t("cartPage.product")}</span>
              <span>{t("cartPage.price")}</span>
              <span>{t("cartPage.quantity")}</span>
              <span>{t("cartPage.subtotal")}</span>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500 py-6">
                {t("cart.empty")}
              </p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 border-t py-6"
                >
                  {/* PRODUCT */}
                  <div className="flex items-center gap-4 md:col-span-2">
                    <img
                      src={item.img}
                      className="w-20 h-20 object-cover rounded-xl"
                      alt=""
                    />
                    <p className="text-sm font-medium">{item.title}</p>
                  </div>

                  {/* PRICE */}
                  <p className="text-sm text-gray-700">
                    {item.price.toLocaleString()} {t("cart.currency")}
                  </p>

                  {/* QTY */}
                  <div className="flex items-center border rounded-lg w-fit">
                    <button
                      onClick={() => updateQty(item.id, "inc")}
                      className="px-3 py-1"
                      aria-label={t("cartPage.inc")}
                      type="button"
                    >
                      +
                    </button>
                    <span className="px-4">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, "dec")}
                      className="px-3 py-1"
                      aria-label={t("cartPage.dec")}
                      type="button"
                    >
                      -
                    </button>
                  </div>

                  {/* TOTAL */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#2B4168] font-medium">
                      {(item.price * item.qty).toLocaleString()}{" "}
                      {t("cart.currency")}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 text-xl"
                      aria-label={t("cartPage.remove")}
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-4 mt-6">
              <input
                placeholder={t("cartPage.discountCode")}
                className="border rounded-lg px-4 py-2 text-sm"
              />
              <button
                className="bg-[#2b41682a] px-6 py-2 rounded-lg text-sm"
                type="button"
              >
                {t("cartPage.applyCoupon")}
              </button>
              <button
                className="bg-[#2b41682a] px-6 py-2 rounded-lg text-sm"
                type="button"
              >
                {t("cartPage.updateCart")}
              </button>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded-2xl p-6 h-fit">
            <h3 className="font-semibold mb-4">{t("cartPage.cartTotals")}</h3>

            <div className="flex justify-between text-sm mb-4">
              <span>{t("cart.total")}</span>
              <span>
                {subtotal.toLocaleString()} {t("cart.currency")}
              </span>
            </div>

            {/* SHIPPING */}
            <div className="space-y-3 mb-4">
              {shippingMethods.map((method) => (
                <label
                  key={method.id}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={shipping.id === method.id}
                    onChange={() => setShipping(method)}
                  />
                  {t(`cartPage.shipping.${method.key}`)}
                  {method.price > 0 && (
                    <span className="text-[#2B4168]">
                      {method.price.toLocaleString()} {t("cart.currency")}
                    </span>
                  )}
                </label>
              ))}
            </div>

            <div className="flex justify-between font-semibold mb-6">
              <span>{t("checkout.total")}</span>
              <span className="text-[#2B4168]">
                {total.toLocaleString()} {t("cart.currency")}
              </span>
            </div>

            <Link to={"/checkout"}>
              <button
                className="w-full bg-[#2b41682a] py-3 rounded-lg font-medium"
                type="button"
              >
                {t("cartPage.proceedToCheckout")}
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
