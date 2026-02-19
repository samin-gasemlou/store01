import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useTranslation } from "react-i18next";
import * as shopAuthApi from "../services/shopAuthApi";

function canCancelWithin2Hours(createdAt) {
  if (!createdAt) return { canCancel: false, minutesLeft: 0 };
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diffMin = (now - created) / (1000 * 60);
  const minutesLeft = Math.max(0, Math.ceil(120 - diffMin));
  return { canCancel: minutesLeft > 0, minutesLeft };
}

function formatMoney(n) {
  const x = Number(n || 0);
  try {
    return x.toLocaleString();
  } catch {
    return String(x);
  }
}

function statusLabel(status, t) {
  const s = String(status || "").toUpperCase();
  if (s === "PENDING") return t("account.status.pending", { defaultValue: "در انتظار" });
  if (s === "ACCEPTED") return t("account.status.accepted", { defaultValue: "تایید شده" });
  if (s === "COMPLETE") return t("account.status.complete", { defaultValue: "تکمیل شده" });
  if (s === "CANCELED") return t("account.status.canceled", { defaultValue: "لغو شده" });
  return s || "-";
}

export default function AccountPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const accessToken = shopAuthApi.getShopAccessToken();

  const TABS = useMemo(
    () => [
      {
        key: "dashboard",
        label: t("account.tabs.dashboard", { defaultValue: "داشبورد" }),
      },
      {
        key: "orders",
        label: t("account.tabs.orders", { defaultValue: "سفارش‌ها" }),
      },
      {
        key: "addresses",
        label: t("account.tabs.addresses", { defaultValue: "آدرس‌ها" }),
      },
      {
        key: "account",
        label: t("account.tabs.account", { defaultValue: "جزئیات حساب" }),
      },
    ],
    [t]
  );

  const [activeTab, setActiveTab] = useState("dashboard");

  const [loadingMe, setLoadingMe] = useState(true);
  const [savingMe, setSavingMe] = useState(false);
  const [meError, setMeError] = useState("");

  const [me, setMe] = useState({
    firstName: "",
    lastName: "",
    phone1: "",
    phone2: "",
    city: "",
    address: "",
    postalCode: "",
  });

  const [addressForm, setAddressForm] = useState({
    city: "",
    address: "",
    postalCode: "",
    phone2: "",
  });

  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!accessToken) navigate("/signin", { replace: true });
  }, [accessToken, navigate]);

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!accessToken) return;

      try {
        setLoadingMe(true);
        setMeError("");

        const data = await shopAuthApi.shopMe(accessToken);
        if (!alive) return;

        const nextMe = {
          firstName: data?.firstName || "",
          lastName: data?.lastName || "",
          phone1: data?.phone1 || "",
          phone2: data?.phone2 || "",
          city: data?.city || "",
          address: data?.address || "",
          postalCode: data?.postalCode || "",
        };

        setMe(nextMe);
        setAddressForm({
          city: nextMe.city,
          address: nextMe.address,
          postalCode: nextMe.postalCode,
          phone2: nextMe.phone2,
        });
      } catch (err) {
        if (!alive) return;
        setMeError(
          err?.data?.message ||
            err?.message ||
            t("account.errors.loadProfile", { defaultValue: "خطا در دریافت پروفایل" })
        );
      } finally {
        if (alive) setLoadingMe(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [accessToken, t]);

  const loadOrders = async () => {
    if (!accessToken) return;

    try {
      setOrdersLoading(true);
      setOrdersError("");

      const out = await shopAuthApi.shopListMyOrders(accessToken, { page: 1, limit: 50 });
      setOrders(Array.isArray(out?.items) ? out.items : []);
    } catch (err) {
      setOrdersError(
        err?.data?.message ||
          err?.message ||
          t("account.errors.loadOrders", { defaultValue: "خطا در دریافت سفارش‌ها" })
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const logout = () => {
    shopAuthApi.clearShopTokens();
    navigate("/signin", { replace: true });
  };

  const saveAccountDetails = async (e) => {
    e.preventDefault();
    if (!accessToken) return;

    try {
      setSavingMe(true);
      setMeError("");

      const updated = await shopAuthApi.shopUpdateMe(
        {
          firstName: me.firstName,
          lastName: me.lastName,
          phone2: me.phone2,
        },
        accessToken
      );

      const nextMe = {
        firstName: updated?.firstName || "",
        lastName: updated?.lastName || "",
        phone1: updated?.phone1 || "",
        phone2: updated?.phone2 || "",
        city: updated?.city || "",
        address: updated?.address || "",
        postalCode: updated?.postalCode || "",
      };

      setMe(nextMe);
      setAddressForm({
        city: nextMe.city,
        address: nextMe.address,
        postalCode: nextMe.postalCode,
        phone2: nextMe.phone2,
      });

      window.alert(
        t("account.alertProfileUpdated", { defaultValue: "اطلاعات با موفقیت ذخیره شد" })
      );
    } catch (err) {
      setMeError(
        err?.data?.message ||
          err?.message ||
          t("account.errors.update", { defaultValue: "به‌روزرسانی ناموفق بود" })
      );
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setSavingMe(false);
    }
  };

  const saveAddresses = async (e) => {
    e.preventDefault();
    if (!accessToken) return;

    try {
      setSavingMe(true);
      setMeError("");

      const updated = await shopAuthApi.shopUpdateMe(
        {
          phone2: addressForm.phone2,
          city: addressForm.city,
          address: addressForm.address,
          postalCode: addressForm.postalCode,
        },
        accessToken
      );

      const nextMe = {
        firstName: updated?.firstName || "",
        lastName: updated?.lastName || "",
        phone1: updated?.phone1 || "",
        phone2: updated?.phone2 || "",
        city: updated?.city || "",
        address: updated?.address || "",
        postalCode: updated?.postalCode || "",
      };

      setMe(nextMe);
      setAddressForm({
        city: nextMe.city,
        address: nextMe.address,
        postalCode: nextMe.postalCode,
        phone2: nextMe.phone2,
      });

      window.alert(
        t("account.alertAddressesSaved", { defaultValue: "آدرس‌ها ذخیره شد" })
      );
    } catch (err) {
      setMeError(
        err?.data?.message ||
          err?.message ||
          t("account.errors.update", { defaultValue: "به‌روزرسانی ناموفق بود" })
      );
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setSavingMe(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!accessToken) return;

    try {
      await shopAuthApi.shopCancelOrder(accessToken, orderId);
      window.alert(t("account.orders.canceledSuccess", { defaultValue: "سفارش لغو شد" }));
      await loadOrders();
    } catch (err) {
      // اگر هنوز روت cancel تو بک نداری اینجا 404 می‌گیری
      window.alert(
        err?.data?.message ||
          err?.message ||
          t("account.orders.cancelFailed", { defaultValue: "لغو سفارش ناموفق بود" })
      );
    }
  };

  const dashboardStats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => String(o.status || "").toUpperCase() === "PENDING").length;
    const accepted = orders.filter((o) => String(o.status || "").toUpperCase() === "ACCEPTED").length;
    const complete = orders.filter((o) => String(o.status || "").toUpperCase() === "COMPLETE").length;
    const canceled = orders.filter((o) => String(o.status || "").toUpperCase() === "CANCELED").length;

    return { total, pending, accepted, complete, canceled };
  }, [orders]);

  const TabButton = ({ tabKey, label }) => {
    const active = activeTab === tabKey;
    return (
      <button
        type="button"
        onClick={() => setActiveTab(tabKey)}
        className={`
          w-full sm:w-auto
          px-4 py-3
          rounded-xl
          border
          transition
          text-sm font-medium
          ${
            active
              ? "bg-[#2B4168] text-white border-[#2B4168]"
              : "bg-white text-[#2B4168] border-[#2B4168]/30"
          }
        `}
      >
        {label}
      </button>
    );
  };

  return (
    <section className="w-full flex flex-col items-center">
      <Navbar />

      <div className="w-full px-2 md:mt-0 mt-15 py-10 mb-20 z-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-semibold text-center mb-8">
            {t("account.title", { defaultValue: "حساب کاربری" })}
          </h1>

          <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3">
              {TABS.map((x) => (
                <TabButton key={x.key} tabKey={x.key} label={x.label} />
              ))}
            </div>

            <button
              onClick={logout}
              className="border border-[#2B4168] text-[#2B4168] px-4 py-3 rounded-xl font-medium"
              type="button"
            >
              {t("account.logout", { defaultValue: "خروج" })}
            </button>
          </div>

          {meError ? (
            <div className="mb-6 text-sm text-red-600 bg-white rounded-2xl p-4 border border-red-200">
              {meError}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-8">
            {activeTab === "dashboard" ? (
              <div className="bg-white rounded-2xl p-6">
                <h2 className="font-semibold mb-4">
                  {t("account.dashboard.summary", { defaultValue: "خلاصه حساب" })}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="border rounded-2xl p-4">
                    <div className="text-xs text-gray-500 mb-2">
                      {t("account.dashboard.totalOrders", { defaultValue: "کل سفارش‌ها" })}
                    </div>
                    <div className="text-lg font-semibold text-[#2B4168]">{dashboardStats.total}</div>
                  </div>

                  <div className="border rounded-2xl p-4">
                    <div className="text-xs text-gray-500 mb-2">
                      {t("account.dashboard.pending", { defaultValue: "در انتظار" })}
                    </div>
                    <div className="text-lg font-semibold text-[#2B4168]">{dashboardStats.pending}</div>
                  </div>

                  <div className="border rounded-2xl p-4">
                    <div className="text-xs text-gray-500 mb-2">
                      {t("account.dashboard.accepted", { defaultValue: "تایید شده" })}
                    </div>
                    <div className="text-lg font-semibold text-[#2B4168]">{dashboardStats.accepted}</div>
                  </div>

                  <div className="border rounded-2xl p-4">
                    <div className="text-xs text-gray-500 mb-2">
                      {t("account.dashboard.completed", { defaultValue: "تکمیل شده" })}
                    </div>
                    <div className="text-lg font-semibold text-[#2B4168]">{dashboardStats.complete}</div>
                  </div>

                  <div className="border rounded-2xl p-4">
                    <div className="text-xs text-gray-500 mb-2">
                      {t("account.dashboard.canceled", { defaultValue: "لغو شده" })}
                    </div>
                    <div className="text-lg font-semibold text-[#2B4168]">{dashboardStats.canceled}</div>
                  </div>
                </div>

                <div className="mt-6 text-sm text-gray-600 leading-7">
                  <div>
                    <span className="font-medium">
                      {t("account.labels.name", { defaultValue: "نام:" })}
                    </span>{" "}
                    {`${me.firstName || ""} ${me.lastName || ""}`.trim() || "-"}
                  </div>

                  <div className="mt-1">
                    <span className="font-medium">
                      {t("account.labels.mobile", { defaultValue: "شماره موبایل:" })}
                    </span>{" "}
                    {me.phone1 || "-"}
                  </div>

                  <div className="mt-1">
                    <span className="font-medium">
                      {t("account.labels.city", { defaultValue: "شهر:" })}
                    </span>{" "}
                    {me.city || "-"}
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "orders" ? (
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="font-semibold">
                    {t("account.orders.title", { defaultValue: "سفارش‌های من" })}
                  </h2>

                  <button
                    type="button"
                    onClick={loadOrders}
                    className="px-4 py-2 rounded-xl bg-[#2b41682a] font-medium"
                  >
                    {t("account.orders.refresh", { defaultValue: "بروزرسانی" })}
                  </button>
                </div>

                {ordersLoading ? (
                  <p className="text-sm text-gray-500">
                    {t("account.orders.loading", { defaultValue: "در حال بارگذاری..." })}
                  </p>
                ) : ordersError ? (
                  <p className="text-sm text-red-600">{ordersError}</p>
                ) : orders.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    {t("account.orders.empty", { defaultValue: "هنوز سفارشی ثبت نکرده‌اید." })}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {orders.map((o) => {
                      const status = String(o.status || "").toUpperCase();
                      const { canCancel, minutesLeft } = canCancelWithin2Hours(o.createdAt);
                      const cancelEnabled = canCancel && status === "PENDING";

                      const itemsCount = Array.isArray(o.items)
                        ? o.items.reduce((acc, it) => acc + Number(it?.quantity || 0), 0)
                        : 0;

                      const subtotal = Array.isArray(o.items)
                        ? o.items.reduce(
                            (acc, it) => acc + Number(it?.price || 0) * Number(it?.quantity || 0),
                            0
                          )
                        : 0;

                      const shipping = Number(o.shippingCost || 0);
                      const discount = Number(o.discount || 0);
                      const total = Math.max(0, subtotal + shipping - discount);

                      return (
                        <div key={o._id} className="border rounded-2xl p-4 text-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="font-semibold text-[#2B4168]">
                              {o.invoiceNumber ||
                                `${t("account.orders.order", { defaultValue: "سفارش" })} ${String(
                                  o._id
                                ).slice(-6)}`}
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-gray-500">{statusLabel(status, t)}</span>
                              <span className="text-gray-400">
                                {o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-gray-600">
                            <div className="border rounded-xl p-3">
                              <div className="text-xs text-gray-500 mb-1">
                                {t("account.orders.itemsCount", { defaultValue: "تعداد آیتم" })}
                              </div>
                              <div className="font-medium">{itemsCount}</div>
                            </div>

                            <div className="border rounded-xl p-3">
                              <div className="text-xs text-gray-500 mb-1">
                                {t("account.orders.shipping", { defaultValue: "هزینه ارسال" })}
                              </div>
                              <div className="font-medium">{formatMoney(shipping)}</div>
                            </div>

                            <div className="border rounded-xl p-3">
                              <div className="text-xs text-gray-500 mb-1">
                                {t("account.orders.discount", { defaultValue: "تخفیف" })}
                              </div>
                              <div className="font-medium">{formatMoney(discount)}</div>
                            </div>

                            <div className="border rounded-xl p-3">
                              <div className="text-xs text-gray-500 mb-1">
                                {t("account.orders.total", { defaultValue: "مجموع" })}
                              </div>
                              <div className="font-medium">{formatMoney(total)}</div>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-gray-500">
                              {cancelEnabled
                                ? t("account.orders.cancelAvailable", {
                                    defaultValue: "امکان لغو تا {{minutes}} دقیقه دیگر",
                                    minutes: minutesLeft,
                                  })
                                : t("account.orders.cancelExpired", {
                                    defaultValue: "بعد از ۲ ساعت امکان لغو وجود ندارد",
                                  })}
                            </div>

                            <button
                              type="button"
                              onClick={() => cancelOrder(o._id)}
                              disabled={!cancelEnabled}
                              className={`
                                border border-[#2B4168]
                                text-[#2B4168]
                                px-4 py-2
                                rounded-xl
                                font-medium
                                ${cancelEnabled ? "" : "opacity-50 cursor-not-allowed"}
                              `}
                            >
                              {t("account.orders.cancel", { defaultValue: "لغو سفارش" })}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-400">
                  {t("account.orders.cancelNote", {
                    defaultValue:
                      "* لغو سفارش فقط تا ۲ ساعت پس از ثبت و فقط در حالت PENDING امکان‌پذیر است.",
                  })}
                </div>
              </div>
            ) : null}

            {activeTab === "addresses" ? (
              <div className="bg-white rounded-2xl p-6">
                <h2 className="font-semibold mb-4">
                  {t("account.addresses.title", { defaultValue: "آدرس‌ها" })}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-2xl p-5">
                    <div className="font-medium text-[#2B4168] mb-3">
                      {t("account.addresses.savedInfoTitle", { defaultValue: "اطلاعات ثبت‌شده" })}
                    </div>

                    <div className="text-sm text-gray-700 space-y-2 leading-7">
                      <div>
                        <span className="font-medium">
                          {t("account.labels.fullName", { defaultValue: "نام و نام خانوادگی:" })}
                        </span>{" "}
                        {`${me.firstName || ""} ${me.lastName || ""}`.trim() || "-"}
                      </div>

                      <div>
                        <span className="font-medium">
                          {t("account.labels.phone1", { defaultValue: "شماره اول:" })}
                        </span>{" "}
                        {me.phone1 || "-"}
                      </div>

                      <div>
                        <span className="font-medium">
                          {t("account.labels.phone2", { defaultValue: "شماره دوم:" })}
                        </span>{" "}
                        {me.phone2 || "-"}
                      </div>

                      <div>
                        <span className="font-medium">
                          {t("account.labels.city", { defaultValue: "شهر:" })}
                        </span>{" "}
                        {me.city || "-"}
                      </div>

                      <div>
                        <span className="font-medium">
                          {t("account.labels.fullAddress", { defaultValue: "آدرس کامل:" })}
                        </span>{" "}
                        {me.address || "-"}
                      </div>

                      <div>
                        <span className="font-medium">
                          {t("account.labels.postalCode", { defaultValue: "کد پستی:" })}
                        </span>{" "}
                        {me.postalCode || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-2xl p-5">
                    <div className="font-medium text-[#2B4168] mb-3">
                      {t("account.addresses.editTitle", { defaultValue: "ویرایش آدرس" })}
                    </div>

                    <form onSubmit={saveAddresses} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          value={addressForm.phone2}
                          onChange={(e) => setAddressForm({ ...addressForm, phone2: e.target.value })}
                          className="w-full border rounded-lg px-4 py-2 text-sm"
                          placeholder={t("account.placeholders.phone2", { defaultValue: "شماره دوم" })}
                          disabled={loadingMe}
                        />

                        <input
                          value={addressForm.postalCode}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, postalCode: e.target.value })
                          }
                          className="w-full border rounded-lg px-4 py-2 text-sm"
                          placeholder={t("account.placeholders.postalCode", { defaultValue: "کد پستی" })}
                          disabled={loadingMe}
                        />
                      </div>

                      <input
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full border rounded-lg px-4 py-2 text-sm"
                        placeholder={t("account.placeholders.city", { defaultValue: "شهر" })}
                        disabled={loadingMe}
                      />

                      <input
                        value={addressForm.address}
                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                        className="w-full border rounded-lg px-4 py-2 text-sm"
                        placeholder={t("account.placeholders.address", { defaultValue: "آدرس کامل" })}
                        disabled={loadingMe}
                      />

                      <button
                        type="submit"
                        disabled={savingMe || loadingMe}
                        className="w-full bg-[#2b41682a] py-2 rounded-lg font-medium"
                      >
                        {savingMe
                          ? t("account.saving", { defaultValue: "در حال ذخیره..." })
                          : t("account.addresses.save", { defaultValue: "ذخیره آدرس" })}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "account" ? (
              <div className="bg-white rounded-2xl p-6">
                <h2 className="font-semibold mb-4">
                  {t("account.profile.title", { defaultValue: "جزئیات حساب" })}
                </h2>

                <form onSubmit={saveAccountDetails} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      value={me.firstName}
                      onChange={(e) => setMe({ ...me, firstName: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2 text-sm"
                      placeholder={t("account.placeholders.firstName", { defaultValue: "نام" })}
                      disabled={loadingMe}
                    />

                    <input
                      value={me.lastName}
                      onChange={(e) => setMe({ ...me, lastName: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2 text-sm"
                      placeholder={t("account.placeholders.lastName", { defaultValue: "نام خانوادگی" })}
                      disabled={loadingMe}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      value={me.phone1}
                      className="w-full border rounded-lg px-4 py-2 text-sm bg-gray-50"
                      placeholder={t("account.placeholders.phone", { defaultValue: "شماره موبایل" })}
                      disabled
                    />

                    <input
                      value={me.phone2}
                      onChange={(e) => setMe({ ...me, phone2: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2 text-sm"
                      placeholder={t("account.placeholders.phone2", { defaultValue: "شماره دوم" })}
                      disabled={loadingMe}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingMe || loadingMe}
                    className="w-full bg-[#2b41682a] py-2 rounded-lg font-medium"
                  >
                    {savingMe
                      ? t("account.saving", { defaultValue: "در حال ذخیره..." })
                      : t("account.profile.save", { defaultValue: "ذخیره" })}
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
