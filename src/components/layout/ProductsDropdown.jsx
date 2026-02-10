import { useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../../data/categories";

export default function ProductsDropdown() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <div className="relative cursor-pointer">
      <div
        className="flex items-center gap-1"
        onClick={() => setOpen((v) => !v)}
      >
        Products
      </div>

      <div
        className={`
          absolute top-6 left-0 bg-white shadow-lg rounded-md py-3 w-56 z-30
          transition-all duration-200 ease-out
          ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"}
        `}
      >
        {categories.map((cat) => (
          <div key={cat.slug} className="px-4">
            {/* Category */}
            <Link
              to={`/store/${cat.slug}`}
              className="block py-2 font-medium"
              onClick={close}
            >
              {cat.title}
            </Link>

            {/* Sub Categories */}
            {cat.children.map((sub) => (
              <Link
                key={sub.slug}
                to={`/store/${cat.slug}/${sub.slug}`}
                className="block pl-4 py-1 text-sm"
                onClick={close}
              >
                {sub.title}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
