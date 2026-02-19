import { Search, Heart, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import ProductsDropdown from "./ProductsDropdown";
import MobileTopBar from "./MobileTopBar";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "../common/LanguageSwitch";
import { getShopAccessToken } from "../../services/shopAuthApi";

export default function Navbar() {
  const { t } = useTranslation();

  const isLoggedIn = !!getShopAccessToken();
  const accountHref = isLoggedIn ? "/account" : "/signin";

  return (
    <header className="w-full md:py-6 absolute top-14 md:top-0 md:relative z-50">
      <MobileTopBar />

      {/* BG */}
      <div className="absolute hidden md:block w-[705px] h-[705px] right-[-100px] top-[-253px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(43,65,104,0.15)_0%,rgba(43,65,104,0)_100%)] -z-40" />

      <div className="w-full hidden mx-auto md:flex items-center justify-between px-4 sm:px-6">
        {/* LEFT */}
        <div className="flex items-center gap-4 sm:gap-10">
          <Link to="/">
            <img src="/logo.svg" alt="logo" />
          </Link>

          {/* ✅ Language (Desktop) */}
          <LanguageSwitch className="hidden md:block" align="left" />
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-8 text-[15px]">
          <Link to="/">{t("nav.home")}</Link>
          <ProductsDropdown />
          <Link to="/store">{t("nav.store")}</Link>
          <Link to="/contact">{t("nav.contact")}</Link>
        </nav>

        {/* DESKTOP ICONS */}
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/search" aria-label="search">
            <Search size={22} />
          </Link>
          <Link to="/wish" aria-label="wishlist">
            <Heart size={22} />
          </Link>
          <Link to="/cart" aria-label="cart">
            <ShoppingCart size={22} />
          </Link>

          <Link to={accountHref} className="flex items-center gap-2">
            <span>{t("nav.account")}</span>
            <User size={22} />
          </Link>
        </div>
      </div>
    </header>
  );
}
