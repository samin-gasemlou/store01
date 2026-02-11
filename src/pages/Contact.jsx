import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Instagram, Mail, Phone, MessageCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = (e) => {
    e.preventDefault();
    console.log("CONTACT FORM:", form);
    alert("Message sent (demo)");
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Navbar />

      <section className="w-full px-4 md:px-10 mb-26 mt-20">
        <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* FORM */}
          <form
            onSubmit={submitForm}
            className="bg-white rounded-2xl p-6 md:p-8"
          >
            <h2 className="text-lg font-semibold mb-6">Send us a message</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm mb-1 block">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full border rounded-lg px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block">Phone number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className="w-full border rounded-lg px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message"
                  className="w-full border rounded-lg px-4 py-3 text-sm min-h-[140px]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2B4168] text-white py-3 rounded-lg mt-6 font-medium"
            >
              Send Message
            </button>
          </form>

          {/* INFO */}
          <div className="flex flex-col justify-between gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
              <p className="text-sm text-gray-600 leading-7">
                At <span className="text-blue-600 font-medium">Foulad Arsan Amol</span>,
                we deeply understand the challenges of time, cost, and safety in
                the construction industry. Using modern technology and local
                expertise, our products are designed to help you build faster,
                safer, and more efficiently.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Office Address:</h3>
              <p className="text-sm text-gray-600">
                Amol, Emam Reza St, Motahari Blvd, Near Square 30
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 border-b pb-3">
                <Instagram size={18} />
                <span>Instagram</span>
              </div>

              <div className="flex items-center gap-3 border-b pb-3">
                <MessageCircle size={18} />
                <span>WhatsApp</span>
              </div>

              <div className="flex items-center gap-3 border-b pb-3">
                <Mail size={18} />
                <span>info@example.com</span>
              </div>

              <div className="flex items-center gap-3 border-b pb-3">
                <Phone size={18} />
                <span>+98 11 3338 8056</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>+98 911 003 0791</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
