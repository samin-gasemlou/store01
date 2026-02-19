import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ✅ اگر این سرویس رو نداری، پایین همین پیام نسخه کاملش رو گذاشتم
import { shopValidatePromo } from "../services/shopOrdersApi";

export default function Cart() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  // ✅ key ثابت برای ترجمه

  // ✅ واقعی: کد تخفیف
  const [coupon, setCoupon] = useState(() => {
    try {
      return localStorage.getItem("cart_coupon") || "";
    } catch {
      return "";
    }
  });
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(() => {
    try {
      return localStorage.getItem("cart_coupon_applied") === "1";
    } catch {
      return false;
    }
  });

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
            qty: type === "inc" ? item.qty + 1 : Math.max(1, item.qty - 1),
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

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  // ✅ discount واقعی (از localStorage)
  const discount = (() => {
    try {
      return Number(localStorage.getItem("cart_discount") || 0) || 0;
    } catch {
      return 0;
    }
  })();

  // ✅ total نهایی با ارسال و تخفیف
  const total = Math.max(0, subtotal - discount);

  // ✅ همیشه snapshot سبد را برای Checkout ذخیره کن (بدون تغییر UI)
  useEffect(() => {
    try {
      const snapshot = {
        items: cartItems.map((it) => ({
          product: String(it.id), // باید Product _id باشد
          quantity: Number(it.qty || 1),
          price: Number(it.price || 0),
          title: it.title,
          img: it.img,
        })),
        subtotal,
        discount,
        promoCode: couponApplied ? String(coupon || "").trim() : "",
        total,
        updatedAt: Date.now(),
      };
      localStorage.setItem("checkout_snapshot", JSON.stringify(snapshot));
    } catch {
      // ignore
    }
  }, [cartItems, subtotal, discount, coupon, couponApplied, total]);

  const applyCoupon = async () => {
    const code = String(coupon || "").trim();
    if (!code) {
      window.alert(t("cartPage.discountCode") || "Discount code is required");
      return;
    }

    try {
      setCouponLoading(true);

      // ✅ میره بک و درصد/مقدار تخفیف رو برمیگردونه
      // اگر بک نداری: سرویس طوری نوشته شده که graceful fail کنه و پیام بده
      const out = await shopValidatePromo({
        code,
        subtotal,
      });

      // out: { ok:true, discount:number, promoCode:string }
      const d = Math.max(0, Number(out?.discount || 0) || 0);

      localStorage.setItem("cart_coupon", code);
      localStorage.setItem("cart_coupon_applied", "1");
      localStorage.setItem("cart_discount", String(d));

      setCouponApplied(true);

      window.alert(
        d > 0
          ? `Coupon applied. Discount: ${d.toLocaleString()}`
          : "Coupon applied."
      );
    } catch (err) {
      // اگر invalid بود، پاک کن
      localStorage.removeItem("cart_coupon_applied");
      localStorage.setItem("cart_discount", "0");
      setCouponApplied(false);

      window.alert(err?.data?.message || err?.message || "Invalid promo code");
      console.error(err);
    } finally {
      setCouponLoading(false);
    }
  };

  const updateCart = () => {
    // ✅ چون cartItems همین الان sync شده، فقط snapshot را force ذخیره می‌کنیم
    try {
      window.dispatchEvent(new Event("cartUpdated"));
      window.alert("Cart updated");
    } catch {
      // ignore
    }
  };

  const goCheckout = (e) => {
    e.preventDefault();

    // ✅ اگر کارت خالیه
    if (!cartItems.length) {
      window.alert(t("cart.empty") || "Cart is empty");
      return;
    }

    // ✅ اگر لاگین نیست
    const token = localStorage.getItem("shop_access_token");
    if (!token) {
      window.alert("Please sign in first");
      navigate("/signin", { replace: true, state: { from: "/checkout" } });
      return;
    }

    navigate("/checkout");
  };

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
              <p className="text-sm text-gray-500 py-6">{t("cart.empty")}</p>
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
                      {(item.price * item.qty).toLocaleString()} {t("cart.currency")}
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
                value={coupon}
                onChange={(e) => {
                  const v = e.target.value;
                  setCoupon(v);
                  try {
                    localStorage.setItem("cart_coupon", v);
                  } catch {
                    // ignore
                  }
                }}
              />
              <button
                className="bg-[#2b41682a] px-6 py-2 rounded-lg text-sm"
                type="button"
                onClick={applyCoupon}
                disabled={couponLoading}
              >
                {couponLoading ? "..." : t("cartPage.applyCoupon")}
              </button>
              <button
                className="bg-[#2b41682a] px-6 py-2 rounded-lg text-sm"
                type="button"
                onClick={updateCart}
              >
                {t("cartPage.updateCart")}
              </button>
            </div>

          {/* SUMMARY (moved from right card) */}
          <div className="bg-white rounded-2xl p-6 h-fit">
            <h3 className="font-semibold mb-4">{t("cartPage.cartTotals")}</h3>

            <div className="flex justify-between text-sm mb-4">
              <span>{t("cart.total")}</span>
              <span>
                {subtotal.toLocaleString()} {t("cart.currency")}
              </span>
            </div>

            {/* ✅ اگر discount داری، UI رو تغییر نمیدیم؛ فقط total خودش کم میشه */}
            <div className="flex justify-between font-semibold mb-6">
              <span>{t("checkout.total")}</span>
              <span className="text-[#2B4168]">
                {total.toLocaleString()} {t("cart.currency")}
              </span>
            </div>

            {/* ✅ بدون تغییر ظاهر: فقط onClick رو واقعی کردیم */}
            <Link to={"/checkout"} onClick={goCheckout}>
              <button
                className="w-full bg-[#2b41682a] py-3 rounded-lg font-medium"
                type="button"
              >
                {t("cartPage.proceedToCheckout")}
              </button>
            </Link>
          </div>
        </div>

          </div>

          
      </section>

      <Footer />
    </div>
  );
}
