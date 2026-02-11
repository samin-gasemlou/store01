import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";

export default function Wish() {
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  });

  useEffect(() => {
    const updateWishlist = () => {
      setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
    };

    window.addEventListener("wishlistUpdated", updateWishlist);
    return () =>
      window.removeEventListener("wishlistUpdated", updateWishlist);
  }, []);

  return (
    <section className="w-full flex flex-col items-center">
      <Navbar />

      <div className="w-full md:mt-10 mt-20 px-4 mb-20 ">
        <h1 className="text-xl font-semibold text-center mb-8">
          Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <p className="text-center text-gray-500">
            Your wishlist is empty.
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
            {wishlist.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </section>
  );
}
