import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";
import { products } from "../data/products";

export default function SearchPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("q") || "";

  const [query, setQuery] = useState(initialQuery);

  // وقتی URL عوض شد (مثلاً سرچ جدید)، state هم آپدیت بشه
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="w-full flex flex-col items-center">
      <Navbar />

      {/* SEARCH HEADER */}
      <div className="w-full max-w-7xl px-4 mt-10 lg:block hidden">
        <h1 className="text-xl font-semibold text-center mb-6">
          Search Products
        </h1>

        {/* SEARCH INPUT */}
        <div className="max-w-xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full border rounded-xl px-5 py-3 text-sm outline-none"
          />
        </div>
      </div>

      {/* RESULTS */}
      <div className="w-full max-w-7xl px-4 mt-10 mb-20">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">
            No products found.
          </p>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
              gap-6
            "
          >
            {filteredProducts.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </section>
  );
}
