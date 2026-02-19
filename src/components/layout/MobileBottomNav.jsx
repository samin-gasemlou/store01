import { Home, Search, ShoppingCart, User, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CartDropdown from "../ui/CartDropdown";
import { useTranslation } from "react-i18next";
import { getShopAccessToken } from "../../services/shopAuthApi";

// ⬇️ جدید: اتصال به بک‌اند
import {
  fetchPublicCategories,
  fetchPublicProducts,
  pickProductTitle,
  slugify,
} from "../../services/shopCatalogApi";

export default function MobileBottomNav() {
  const { t, i18n } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const [q, setQ] = useState("");

  // ✅ کاتگوری‌ها از بک
  const [categories, setCategories] = useState([]);

  // ✅ پیشنهاد سرچ از بک
  const [suggestions, setSuggestions] = useState([]);

  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  const menuWrapRef = useRef(null);
  const searchWrapRef = useRef(null);
  const cartWrapRef = useRef(null);

  const isAuthPage =
    location.pathname === "/signin" || location.pathname === "/signup";

  useEffect(() => {
    const readCart = () => {
      try {
        setCartItems(JSON.parse(localStorage.getItem("cart")) || []);
      } catch {
        setCartItems([]);
      }
    };
    window.addEventListener("cartUpdated", readCart);
    return () => window.removeEventListener("cartUpdated", readCart);
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (menuWrapRef.current && !menuWrapRef.current.contains(e.target))
        setMenuOpen(false);
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target))
        setSearchOpen(false);
      if (cartWrapRef.current && !cartWrapRef.current.contains(e.target))
        setCartOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    setSearchOpen(false);
    setMenuOpen(false);
    setCartOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const closeAll = () => {
    setMenuOpen(false);
    setSearchOpen(false);
    setCartOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  if (isAuthPage) return null;

  const BTN = "w-11 h-11";
  const ICON = 22;

  const btnClass = (active) => `
    ${BTN}
    flex items-center justify-center rounded-[10px]
    transition
    ${active ? "bg-[#2A3E63] text-white" : "text-black"}
  `;

  // ✅ RTL (برای ar و ku)
  const lang = (i18n.language || "en").split("-")[0];
  const isRTL = lang === "ar" || lang === "ku";

  const isLoggedIn = !!getShopAccessToken();
  const accountHref = isLoggedIn ? "/account" : "/signin";

  // ✅ 1) گرفتن دسته‌بندی‌ها از بک‌اند
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetchPublicCategories({ limit: 200 });
        const data = Array.isArray(res?.data) ? res.data : [];

        // normalize: فرانت دنبال { slug, title } است
        const normalized = data
          .map((c) => {
            const title =
              (lang === "ar" ? c?.name_ar : lang === "ku" ? (c?.name_kur || c?.name_ku) : c?.name_en) ||
              c?.name_en ||
              c?.name_ar ||
              c?.name_kur ||
              "";

            const slug = slugify(c?.name_en || title);

            return {
              slug,
              title,
              _raw: c,
            };
          })
          .filter((x) => x.slug && x.title);

        if (mounted) setCategories(normalized);
      } catch {
        // اگر fetch شکست خورد، چیزی نمی‌ریزیم (ظاهر تغییر نکنه)
        if (mounted) setCategories([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [lang]);

  // ✅ 2) پیشنهادهای سرچ از بک‌اند (debounce)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    let cancelled = false;

    const query = q.trim();
    if (!query) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        // مطابق بک‌اند: /products?q=...&limit=6
        // fields برای سبک‌تر شدن پاسخ
        const res = await fetchPublicProducts({
          q: query,
          limit: 6,
          fields: "_id,name_en,name_ar,name_ku,name_kur,name",
        });

        const items = Array.isArray(res?.data) ? res.data : [];

        const normalized = items
          .map((p) => ({
            id: p?._id,
            title: pickProductTitle(p, i18n.language),
          }))
          .filter((x) => x.id && x.title);

        if (!cancelled) setSuggestions(normalized);
      } catch {
        if (!cancelled) setSuggestions([]);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [q, i18n.language]);

  return (
    <nav
      className="
        fixed bottom-0 z-50 lg:hidden w-full flex items-center justify-center
        pb-[max(env(safe-area-inset-bottom),12px)]
      "
    >
      <div className="w-full px-4 flex items-center justify-center">
        <div className="mx-auto w-full flex justify-center">
          <div
            className="
              relative
              w-full
              sm:w-auto
              flex items-center justify-between
              gap-3
              bg-white
              px-4 py-3
              rounded-[10px]
              shadow-lg
            "
          >
            {/* Cart */}
            <div ref={cartWrapRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setSearchOpen(false);
                  setCartOpen((v) => !v);
                }}
                className={btnClass(cartOpen)}
                aria-label={t("mobileNav.cart")}
              >
                <ShoppingCart size={ICON} />
              </button>

              <CartDropdown
                open={cartOpen}
                cartItems={cartItems}
                onClose={() => setCartOpen(false)}
                align={isRTL ? "right" : "left"} // ✅ اینجا جهت رو میدیم
              />
            </div>

            {/* Search */}
            <div ref={searchWrapRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setCartOpen(false);
                  setSearchOpen((v) => !v);
                }}
                className={btnClass(searchOpen)}
                aria-label={t("mobileNav.search")}
              >
                <Search size={ICON} />
              </button>

              <div
                className={`
                  absolute bottom-14 ${isRTL ? "right-20 translate-x-1/2" : "left-20 -translate-x-1/2"}
                  w-[260px] bg-white rounded-[10px] shadow-lg p-3
                  transition-all duration-200
                  ${
                    searchOpen
                      ? "opacity-100 visible"
                      : "opacity-0 invisible pointer-events-none"
                  }
                `}
              >
                <form onSubmit={submitSearch} className="flex items-center gap-2">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={t("mobileNav.searchPlaceholder")}
                    className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-[#2A3E63] text-white text-sm"
                  >
                    {t("mobileNav.go")}
                  </button>
                </form>

                {q.trim() && (
                  <div className="mt-3">
                    {suggestions.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          closeAll();
                          navigate(`/search?q=${encodeURIComponent(q.trim())}`);
                        }}
                        type="button"
                        className={`block w-full ${
                          isRTL ? "text-right" : "text-left"
                        } text-[13px] px-2 py-2 rounded-lg hover:bg-gray-50`}
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Home */}
            <Link
              to="/"
              onClick={closeAll}
              className={btnClass(isActive("/"))}
              aria-label={t("mobileNav.home")}
            >
              <Home size={ICON} />
            </Link>

            {/* Account */}
            <Link
              to={accountHref}
              onClick={closeAll}
              className={btnClass(isActive("/account"))}
              aria-label={t("mobileNav.account")}
            >
              <User size={ICON} />
            </Link>

            {/* Categories */}
            <div ref={menuWrapRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setCartOpen(false);
                  setMenuOpen((v) => !v);
                }}
                className={btnClass(menuOpen)}
                aria-label={t("mobileNav.categories")}
              >
                <Menu size={ICON} />
              </button>

              <div
                className={`
                  absolute bottom-14 ${isRTL ? "left-0" : "right-0"}
                  w-[220px] text-[13px]
                  bg-white rounded-[10px] shadow-lg p-3
                  transition-all duration-200
                  ${
                    menuOpen
                      ? "opacity-100 visible"
                      : "opacity-0 invisible pointer-events-none"
                  }
                `}
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/store/${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2"
                  >
                    {t(`categories.${cat.slug}`, { defaultValue: cat.title })}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
