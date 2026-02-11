import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";
import BreadCrumb from "../components/layout/BreadCrumb";
import { products } from "../data/products";
import { toSlug, fromSlug } from "../utils/slug";

export default function Store() {
  const { category, subCategory } = useParams();

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const categorySlug = toSlug(p.category);
      const subCategorySlug = toSlug(p.subCategory);

      if (category && categorySlug !== category) return false;
      if (subCategory && subCategorySlug !== subCategory) return false;

      return true;
    });
  }, [category, subCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const safePage = currentPage > totalPages ? 1 : currentPage;

  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const title = subCategory
    ? fromSlug(subCategory)
    : category
    ? fromSlug(category)
    : "Store";

  return (
    <section className="flex flex-col items-center w-full">
      <Navbar />

      <div className="w-[90%] md:w-full  mx-auto px-2 md:mt-0 mt-20">
        <BreadCrumb category={category} subCategory={subCategory} />

        <h1 className="text-center text-xl font-semibold mb-8 w-full">
          {title}
        </h1>

        {/* ✅ PRODUCTS GRID — فاصله یکسان در همه سایزها */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            gap-6
            mb-12
          "
        >
          {currentProducts.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mb-20 w-full">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={safePage === 1}
              className="px-3 py-2 border-none disabled:opacity-40"
            >
              <img src="/arrow-circle-left.svg" alt="" />
            </button>

            <div className="hidden sm:flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className="w-9 h-9 border border-[#1C1E1F] rounded-full"
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="flex sm:hidden">
              <button className="w-9 h-9 border border-[#1C1E1F] rounded-full">
                {safePage}
              </button>
            </div>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={safePage === totalPages}
              className="px-3 py-2 border-none disabled:opacity-40"
            >
              <img src="/arrow-circle-left2.svg" alt="" />
            </button>
          </div>
        )}
      </div>

      <Footer />
    </section>
  );
}
