import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useTranslation } from "react-i18next";

export default function AccountPage() {
  const { t } = useTranslation();

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert(t("account.alertProfileUpdated"));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert(t("account.alertPasswordChanged"));
    setPassword({ current: "", new: "" });
  };

  const logout = () => {
    alert(t("account.alertLoggedOut"));
  };

  return (
    <section className="w-full flex flex-col items-center">
      <Navbar />

      <div className="w-full px-2 md:mt-0 mt-15 py-10 mb-20 z-50">
        <h1 className="text-xl font-semibold text-center mb-8">
          {t("account.title")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PROFILE INFO */}
          <div className="bg-white rounded-2xl p-6">
            <h2 className="font-semibold mb-4">{t("account.profile.title")}</h2>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <input
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 text-sm"
                placeholder={t("account.profile.fullName")}
              />

              <input
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 text-sm"
                placeholder={t("account.profile.email")}
              />

              <button
                type="submit"
                className="w-full bg-[#2b41682a] py-2 rounded-lg font-medium"
              >
                {t("account.profile.save")}
              </button>
            </form>
          </div>

          {/* PASSWORD */}
          <div className="bg-white rounded-2xl p-6">
            <h2 className="font-semibold mb-4">{t("account.password.title")}</h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                value={password.current}
                onChange={(e) =>
                  setPassword({ ...password, current: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2 text-sm"
                placeholder={t("account.password.current")}
              />

              <input
                type="password"
                value={password.new}
                onChange={(e) => setPassword({ ...password, new: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 text-sm"
                placeholder={t("account.password.new")}
              />

              <button
                type="submit"
                className="w-full bg-[#2b41682a] py-2 rounded-lg font-medium"
              >
                {t("account.password.update")}
              </button>
            </form>
          </div>

          {/* ORDERS */}
          <div className="bg-white rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="font-semibold mb-4">{t("account.orders.title")}</h2>

              <p className="text-sm text-gray-500 mb-6">
                {t("account.orders.empty")}
              </p>
            </div>

            <button
              onClick={logout}
              className="w-full border border-[#2B4168] text-[#2B4168] py-2 rounded-lg font-medium"
              type="button"
            >
              {t("account.logout")}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
