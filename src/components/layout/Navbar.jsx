import {
  Search,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import ProductsDropdown from "./ProductsDropdown";
import { useState } from "react";
import MobileTopBar from "./MobileTopBar";
export default function Navbar() {
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="w-full md:py-6 absolute top-14 md:top-0 md:relative z-50">
      <MobileTopBar />
      {/* BG */}
      <div className="absolute  w-[605px] h-[705px] right-[-100px] top-[-253px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(43,65,104,0.15)_0%,rgba(43,65,104,0)_100%)] -z-10" />

      <div className="max-w-[1400px] hidden mx-auto md:flex items-center justify-between px-4 sm:px-6">
        {/* LEFT */}
        <div className="flex items-center gap-4 sm:gap-10">
          <img src="/logo.svg" alt="logo" />

          {/* Language */}
          <div
            className="relative cursor-pointer hidden md:block"
            onClick={() => setLangOpen(!langOpen)}
          >
            <div className="flex items-center gap-1 text-sm text-gray-700">
              EN <ChevronDown size={16} />
            </div>

            <div
              className={`
                absolute left-0 top-6 bg-white shadow-lg rounded-md py-3 w-28
                transition-all duration-200
                ${langOpen ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95"}
              `}
            >
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">
                Persian
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">
                Cur
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">
                Ar
              </button>
            </div>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-8 text-[15px]">
          <Link to="/">Home</Link>
          <ProductsDropdown />
          <Link to="/store">Store</Link>
          <Link to="/contact">Contact us</Link>
        </nav>

        {/* DESKTOP ICONS */}
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/search"><Search size={22} /></Link>
          <Link to="/wish"><Heart size={22} /></Link>
          <Link to="/cart"><ShoppingCart size={22} /></Link>
          <Link to="/account" className="flex items-center gap-2">
            <span>Account</span>
            <User size={22} />
          </Link>
        </div>
      </div>
    </header>
  );
}
