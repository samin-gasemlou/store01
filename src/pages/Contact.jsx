import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Instagram, Mail, Phone, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const submitForm = (e) => {
    e.preventDefault();
    console.log("CONTACT FORM:", form);
    alert(t("contact.alertSent"));
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Navbar />

      <section className="w-full px-4 md:px-10 mb-26 mt-20">
        <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* INFO */}
          <div className="flex flex-col justify-between gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {t("contact.info.title")}
              </h2>

              <p className="text-sm text-gray-600 leading-7">
                {t("contact.info.desc", {
                  brand: t("contact.info.brand"),
                })}
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">
                {t("contact.info.addressTitle")}
              </h3>
              <p className="text-sm text-gray-600">{t("contact.info.address")}</p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 border-b pb-3">
                <Instagram size={18} />
                <span>{t("contact.channels.instagram")}</span>
              </div>

              <div className="flex items-center gap-3 border-b pb-3">
                <MessageCircle size={18} />
                <span>{t("contact.channels.whatsapp")}</span>
              </div>

              <div className="flex items-center gap-3 border-b pb-3">
                <Mail size={18} />
                <span>{t("contact.channels.emailValue")}</span>
              </div>

              <div className="flex items-center gap-3 border-b pb-3">
                <Phone size={18} />
                <span>{t("contact.channels.phone1")}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>{t("contact.channels.phone2")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
