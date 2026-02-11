import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useTranslation } from "react-i18next";

export default function Checkout() {
  const { t, i18n } = useTranslation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "Iran",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
    email: "",
    note: "",
  });

  // ✅ وقتی زبان عوض شد، فقط فیلدهای ثابت/پیشفرض رو (اگر خالی هستند) هماهنگ کن
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      country: t("checkout.countryValue"),
      province: prev.province || t("checkout.provinceDefault"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  const shippingMethods = [
    { id: 1, key: "chapaar", price: 0 },
    { id: 2, key: "post", price: 85000 },
    { id: 3, key: "tipax", price: 120000 },
    { id: 4, key: "cargo", price: 150000 },
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

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + shipping.price;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitOrder = () => {
    if (cartItems.length === 0) {
      alert(t("checkout.alertEmptyCart"));
      return;
    }

    console.log("ORDER DATA:", { form, cartItems, shipping, total });
    alert(t("checkout.alertSubmitted"));

    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
    setCartItems([]);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Navbar />

      <section className="w-full px-2 mt-20 md:px-10 pb-20">
        <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ORDER SUMMARY */}
          <div className="bg-white rounded-2xl p-6 h-fit">
            <h3 className="font-semibold mb-4">{t("checkout.yourOrder")}</h3>

            <div className="text-sm text-gray-500 grid grid-cols-2 mb-4">
              <span>{t("checkout.product")}</span>
              <span className="text-right">{t("checkout.subtotal")}</span>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-t py-4 text-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.img}
                    className="w-14 h-14 rounded-lg object-cover"
                    alt=""
                  />
                  <span>
                    {item.title} × {item.qty}
                  </span>
                </div>

                <span className="text-[#2B4168]">
                  {(item.price * item.qty).toLocaleString()} {t("cart.currency")}
                </span>
              </div>
            ))}

            <div className="border-t pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>{t("checkout.subtotal")}</span>
                <span>
                  {subtotal.toLocaleString()} {t("cart.currency")}
                </span>
              </div>

              <div className="space-y-2">
                {shippingMethods.map((method) => (
                  <label key={method.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={shipping.id === method.id}
                      onChange={() => setShipping(method)}
                    />
                    {t(`checkout.shipping.${method.key}`)}
                    {method.price > 0 && (
                      <span className="text-[#2B4168]">
                        {method.price.toLocaleString()} {t("cart.currency")}
                      </span>
                    )}
                  </label>
                ))}
              </div>

              <div className="flex justify-between font-semibold text-base pt-4">
                <span>{t("checkout.total")}</span>
                <span className="text-[#2B4168]">
                  {total.toLocaleString()} {t("cart.currency")}
                </span>
              </div>
            </div>
          </div>

          {/* BILLING DETAILS */}
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-semibold mb-4">{t("checkout.billingDetails")}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="firstName"
                value={form.firstName}
                placeholder={t("checkout.firstName")}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 text-sm"
              />
              <input
                name="lastName"
                value={form.lastName}
                placeholder={t("checkout.lastName")}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 text-sm"
              />
            </div>

            <input
              name="company"
              value={form.company}
              placeholder={t("checkout.company")}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 text-sm w-full mt-4"
            />

            <input
              name="country"
              value={form.country}
              disabled
              className="border rounded-lg px-4 py-2 text-sm w-full mt-4 bg-gray-50"
            />

            <input
              name="address"
              value={form.address}
              placeholder={t("checkout.address")}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 text-sm w-full mt-4"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                name="city"
                value={form.city}
                placeholder={t("checkout.city")}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 text-sm"
              />
              <input
                name="province"
                value={form.province}
                placeholder={t("checkout.province")}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 text-sm"
              />
            </div>

            <input
              name="postalCode"
              value={form.postalCode}
              placeholder={t("checkout.postalCode")}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 text-sm w-full mt-4"
            />

            <input
              name="phone"
              value={form.phone}
              placeholder={t("checkout.phone")}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 text-sm w-full mt-4"
            />

            <input
              name="email"
              value={form.email}
              placeholder={t("checkout.email")}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 text-sm w-full mt-4"
            />

            <textarea
              name="note"
              value={form.note}
              placeholder={t("checkout.note")}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 text-sm w-full mt-4 min-h-[100px]"
            />

            <button
              onClick={submitOrder}
              className="w-full bg-[#2b41682a] py-3 rounded-lg font-medium mt-6"
            >
              {t("checkout.placeOrder")}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
