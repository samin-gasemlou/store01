import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { shopCreateOrder } from "../services/shopOrdersApi";

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    mobile1: "",
    mobile2: "",
    city: "sulaymaniyah",
    address: "",
    note: "",
    promoCode: "",
  });

  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleCartUpdate = () => {
      try {
        setCartItems(JSON.parse(localStorage.getItem("cart")) || []);
      } catch {
        setCartItems([]);
      }
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const cityOptions = useMemo(
    console.log(i18n.language),
    () => [
      { value: "sulaymaniyah", label: t("checkout.city.sulaymaniyah") },
      { value: "kurdistan", label: t("checkout.city.kurdistan") },
      { value: "iraq", label: t("checkout.city.iraq") },
    ],
    [t]
    
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
        0
      ),
    [cartItems]
  );

  const totalQty = useMemo(
    () => cartItems.reduce((s, it) => s + Number(it.qty || 0), 0),
    [cartItems]
  );

  const isFreeShipping = totalQty >= 2;
  const shippingPrice = isFreeShipping ? 0 : 85000;
  const total = subtotal + shippingPrice;

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const normalizePhone = (v) =>
    String(v || "").trim().replace(/[\s-]/g, "");

  const submitOrder = async () => {
    const token = localStorage.getItem("shop_access_token");
    if (!token) {
      alert(t("checkout.loginRequired"));
      navigate("/signin", { replace: true, state: { from: "/checkout" } });
      return;
    }

    if (!cartItems.length) {
      alert(t("checkout.alertEmptyCart"));
      return;
    }

    if (!form.fullName.trim())
      return alert(t("checkout.fullNameRequired"));

    if (!form.mobile1.trim())
      return alert(t("checkout.mobileRequired"));

    if (!form.address.trim())
      return alert(t("checkout.addressRequired"));

    const ok = window.confirm(t("checkout.confirmSubmit"));
    if (!ok) return;

    const items = cartItems.map((it) => ({
      product: String(it.id),
      quantity: Number(it.qty || 1),
    }));

    try {
      setLoading(true);

      await shopCreateOrder({
        items,
        city: form.city,
        address: form.address,
        customerNote: form.note,
        promoCode: form.promoCode,
        fullName: form.fullName,
        mobile1: normalizePhone(form.mobile1),
        mobile2: normalizePhone(form.mobile2),
        shippingMethod: "post",
      });

      alert(t("checkout.alertSubmitted"));

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/account");
    } catch (err) {
      alert(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center -z-10">
      <Navbar />

      <section className="w-full px-4 mt-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* SUMMARY */}
          <div className="bg-white rounded-2xl p-6 border">
            <h3 className="font-semibold mb-4">
              {t("checkout.yourOrder")}
            </h3>

            {cartItems.length === 0 ? (
              <p>{t("cart.empty")}</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex justify-between py-2">
                  <span>{item.title} × {item.qty}</span>
                  <span>
                    {(item.price * item.qty).toLocaleString()}{" "}
                    {t("cart.currency")}
                  </span>
                </div>
              ))
            )}

            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex justify-between">
                <span>{t("checkout.subtotal")}</span>
                <span>{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>{t("checkout.shippingTitle")}</span>
                <span>
                  {isFreeShipping
                    ? t("checkout.freeShipping")
                    : shippingPrice.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between font-bold">
                <span>{t("checkout.total")}</span>
                <span>{total.toLocaleString()}</span>
              </div>

              <p className="text-xs text-gray-500">
                {t("checkout.paymentNote")}
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white rounded-2xl p-6 border">
            <h3 className="font-semibold mb-4">
              {t("checkout.billingDetails")}
            </h3>

            <input
              name="fullName"
              value={form.fullName}
              placeholder={t("checkout.fullName")}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 w-full mb-4"
            />

            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 w-full mb-4"
            >
              {cityOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <input
              name="mobile1"
              value={form.mobile1}
              placeholder={t("checkout.phone")}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 w-full mb-4"
            />

            <textarea
              name="address"
              value={form.address}
              placeholder={t("checkout.address")}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 w-full mb-4"
            />

            <button
              onClick={submitOrder}
              disabled={loading}
              className="w-full bg-[#2b41682a] py-3 rounded-xl"
            >
              {loading ? "..." : t("checkout.placeOrder")}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
