import { useState } from "react";
import { Menu, X, Search, Heart, ShoppingCart, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import ProductsDropdown from "./ProductsDropdown";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false); // ← فقط همین اضافه شده

  return (
    <header className="w-full py-6">
      <div className="absolute w-[605px] h-[705px] right-[-100px] top-[-253px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(43,65,104,0.15)_0%,rgba(43,65,104,0)_100%)] -z-10" />

      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6">

        {/* Left: Logo + Language */}
        <div className="flex items-center text-center gap-4 sm:gap-10">

          {/* Logo */}
          <div className="leading-none">
            <img src="/logo.svg" alt="" />
          </div>

          {/* Language Dropdown */}
          <div
            className="group relative cursor-pointer"
            onClick={() => setLangOpen(!langOpen)}  // ← موبایل را clickable می‌کند
          >
            <div className="flex items-center gap-1 text-sm text-gray-700 hover:text-black">
              EN <ChevronDown size={16} />
            </div>

            {/* Dropdown Menu */}
            <div
              className={`
                absolute left-0 top-6 bg-white shadow-lg rounded-md py-3 w-28 z-20
                ${langOpen ? "block" : "hidden"} 
                sm:group-hover:block      /* ← دسکتاپ با hover */
              `}
            >
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">Persian</button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">Cur</button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">Ar</button>

            </div>
          </div>

        </div>

        {/* Center Nav (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10 text-[14px] xl:text-[15px] text-gray-800">
        <Link to={"/"}><div className="hover:text-black transition" href="#">Home</div></Link>

          <ProductsDropdown />

          

         <Link to={"/store"}><div className="hover:text-black transition">Store</div></Link>
         <Link to={"/contact"}><div className="hover:text-black transition">Contact us</div></Link>
        </nav>

        {/* Right Icons */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-7 text-gray-800">
          <Link to={"/search"}><Search size={22} className="cursor-pointer" /></Link>
          <Link to={"/wish"}><Heart size={22} className="cursor-pointer" /></Link>
          <Link to={"/cart"}><ShoppingCart size={22} className="cursor-pointer"/></Link>

          <Link to={"/account"}><div className="flex items-center gap-2 cursor-pointer hover:text-black">
            <span className="text-[14px] xl:text-[15px]">Account</span>
            <User size={22} />
          </div></Link>
        </div>

        {/* Mobile Button */}
        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden mt-4 px-4 pb-6 space-y-3 text-gray-800 text-[15px] max-h-[70vh] overflow-y-auto flex flex-col items-start justify-center">
          <Link to={"/"}><div className="block">Home</div></Link>
          <ProductsDropdown />
          <Link to={"/store"}><div className="block">Store</div></Link>
        <Link to={"/contact"}><div className="block">Contact us</div></Link>
        <div className="flex items-center justify-start gap-2">
          <Link to={"/search"}><Search size={22} className="cursor-pointer" /></Link>
          <Link to={"/wish"}><Heart size={22} className="cursor-pointer" /></Link>
          <Link to={"/cart"}><ShoppingCart size={22} className="cursor-pointer"/></Link>
        </div>
         <Link to={"/account"}><div className="flex items-center gap-2 cursor-pointer hover:text-black">
            <span className="text-[14px] xl:text-[15px]">Account</span>
            <User size={22} />
          </div></Link>
        </div>
      )}
    </header>
  );
}
