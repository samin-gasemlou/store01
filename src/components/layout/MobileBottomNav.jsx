import { Home, Search, ShoppingCart, User, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories } from "../../data/categories";
import { products } from "../../data/products";
import CartDropdown from "../ui/CartDropdown";

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const [q, setQ] = useState("");
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

  const suggestions = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return products
      .filter((p) => p.title.toLowerCase().includes(query))
      .slice(0, 6);
  }, [q]);

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
      if (menuWrapRef.current && !menuWrapRef.current.contains(e.target)) setMenuOpen(false);
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) setSearchOpen(false);
      if (cartWrapRef.current && !cartWrapRef.current.contains(e.target)) setCartOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // ✅ اینجا return null کاملاً درست و بدون مشکل Hook
  if (isAuthPage) return null;

  return (
    <nav
      className="
        fixed
        inset-x-0 mr-24 md:mr-0
        bottom-4
        z-50
        lg:hidden
        flex
        justify-center
      "
    >
      <div
        className="
          flex items-center gap-4
          bg-[#ffffff]
          px-8 py-3 md:px-20
          rounded-[10px]
          shadow-lg
        "
      >
        {/* ⬅️ LEFT : Cart */}
        <div ref={cartWrapRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(false);
              setCartOpen((v) => !v);
            }}
            className={`
              w-11 h-11 flex items-center justify-center rounded-[10px]
              ${cartOpen ? "bg-[#2A3E63] text-white" : "text-black"}
            `}
          >
            <ShoppingCart size={22} />
          </button>

          <CartDropdown
            open={cartOpen}
            cartItems={cartItems}
            onClose={() => setCartOpen(false)}
          />
        </div>

        {/* ⬅️ LEFT : Search */}
        <div ref={searchWrapRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setCartOpen(false);
              setSearchOpen((v) => !v);
            }}
            className={`
              w-11 h-11 flex items-center justify-center rounded-[10px]
              ${searchOpen ? "bg-[#2A3E63] text-white" : "text-black"}
            `}
          >
            <Search size={22} />
          </button>

          <div
            className={`
              absolute bottom-14 left-18 -translate-x-1/2
              w-[260px] bg-white rounded-[10px] shadow-lg p-3
              transition-all duration-200
              ${searchOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
            `}
          >
            <form onSubmit={submitSearch} className="flex items-center gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for products..."
                className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-[#2A3E63] text-white text-sm"
              >
                Go
              </button>
            </form>

            {q.trim() && (
              <div className="mt-3">
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSearchOpen(false);
                      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
                    }}
                    className="block w-full text-left text-[13px] px-2 py-2 rounded-lg hover:bg-gray-50"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 🟢 CENTER : Home */}
        <Link
          to="/"
          className={`
            w-12 h-12
            flex items-center justify-center
            rounded-[10px]
            ${location.pathname === "/" ? "bg-[#2A3E63] text-white" : "text-black"}
          `}
        >
          <Home size={24} />
        </Link>

        {/* ➡️ RIGHT : Account */}
        <Link
          to="/account"
          className={`
            w-11 h-11
            flex items-center justify-center
            rounded-[10px]
            ${location.pathname === "/account" ? "bg-[#2A3E63] text-white" : "text-black"}
          `}
        >
          <User size={22} />
        </Link>

        {/* ➡️ RIGHT : Categories */}
        <div ref={menuWrapRef} className="relative">
          <button
            onClick={() => {
              setSearchOpen(false);
              setCartOpen(false);
              setMenuOpen((v) => !v);
            }}
            className={`
              w-11 h-11 flex items-center justify-center rounded-[10px]
              ${menuOpen ? "bg-[#2A3E63] text-white" : "text-black"}
            `}
          >
            <Menu size={22} />
          </button>

          <div
            className={`
              absolute bottom-14 right-0
              w-[220px] text-[13px]
              bg-white rounded-[10px] shadow-lg p-3
              ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
            `}
          >
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/store/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className="block py-2"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
