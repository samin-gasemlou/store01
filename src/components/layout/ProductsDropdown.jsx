import { useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../../data/categories";

export default function ProductsDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative cursor-pointer">
      <div
        className="flex items-center gap-1"
        onClick={() => setOpen(!open)} // باز/بسته شدن منو در موبایل
      >
        Products
      </div>

      {/* دسکتاپ: group-hover | موبایل: open */}
      <div
        className={`absolute top-6 left-0 bg-white shadow-lg rounded-md py-3 w-56 z-30 
          ${open ? "block" : "hidden"} 
          md:group-hover:block`}
      >
        {categories.map((cat) => (
          <div key={cat.slug} className="px-4">
            {/* Category */}
            <Link to={`/store/${cat.slug}`} className="block py-2 font-medium">
              {cat.title}
            </Link>

            {/* Sub Categories */}
            {cat.children.map((sub) => (
              <Link
                key={sub.slug}
                to={`/store/${cat.slug}/${sub.slug}`}
                className="block pl-4 py-1 text-sm"
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
