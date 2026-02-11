import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Checkout() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "Iran",
    address: "",
    city: "",
    province: "Tehran",
    postalCode: "",
    phone: "",
    email: "",
    note: "",
  });

  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const shippingMethods = [
    { id: 1, title: "Chapaar (Recommended)", price: 0 },
    { id: 2, title: "Post", price: 85000 },
    { id: 3, title: "Tipax", price: 120000 },
    { id: 4, title: "Cargo", price: 150000 },
  ];

  const [shipping, setShipping] = useState(shippingMethods[0]);

  useEffect(() => {
    // Listener برای همگام‌سازی سبد خرید اگر در صفحات دیگر تغییر کند
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(updatedCart);
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const total = subtotal + shipping.price;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitOrder = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    console.log("ORDER DATA:", { form, cartItems, shipping, total });
    alert("Order submitted (demo)");

    // می‌توانیم بعد از submit، سبد خرید را خالی کنیم
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
            <h3 className="font-semibold mb-4">Your Order</h3>

            <div className="text-sm text-gray-500 grid grid-cols-2 mb-4">
              <span>Product</span>
              <span className="text-right">Subtotal</span>
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
                  />
                  <span>
                    {item.title} × {item.qty}
                  </span>
                </div>
                <span className="text-[#2B4168]">
                  {(item.price * item.qty).toLocaleString()} Toman
                </span>
              </div>
            ))}

            <div className="border-t pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()} Toman</span>
              </div>

              <div className="space-y-2">
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      checked={shipping.id === method.id}
                      onChange={() => setShipping(method)}
                    />
                    {method.title}
                    {method.price > 0 && (
                      <span className="text-[#2B4168]">
                        {method.price.toLocaleString()} Toman
                      </span>
                    )}
                  </label>
                ))}
              </div>

              <div className="flex justify-between font-semibold text-base pt-4">
                <span>Total</span>
                <span className="text-[#2B4168]">{total.toLocaleString()} Toman</span>
              </div>
            </div>
          </div>

          {/* BILLING DETAILS */}
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Billing Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="firstName"
                placeholder="First name *"
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 text-sm"
              />
              <input
                name="lastName"
                placeholder="Last name *"
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 text-sm"
              />
            </div>

            <input
              name="company"
              placeholder="Company name (optional)"
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 text-sm w-full mt-4"
            />

            <input
              name="country"
              value="Iran"
              disabled
              className="border rounded-lg px-4 py-2 text-sm w-full mt-4 bg-gray-50"
            />

            <input
              name="address"
              placeholder="Street address *"
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 text-sm w-full mt-4"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                name="city"
                placeholder="City *"
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 text-sm"
              />
              <input
                name="province"
                placeholder="Province *"
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 text-sm"
              />
            </div>

            <input
              name="postalCode"
              placeholder="Postal code *"
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 text-sm w-full mt-4"
            />

            <input
              name="phone"
              placeholder="Phone *"
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 text-sm w-full mt-4"
            />

            <input
              name="email"
              placeholder="Email address *"
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 text-sm w-full mt-4"
            />

            <textarea
              name="note"
              placeholder="Order notes (optional)"
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 text-sm w-full mt-4 min-h-[100px]"
            />

            <button
              onClick={submitOrder}
              className="w-full bg-[#2b41682a] py-3 rounded-lg font-medium mt-6"
            >
              Place Order
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
