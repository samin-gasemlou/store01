import { useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";
import BreadCrumb from "../components/layout/BreadCrumb";
import { toSlug, fromSlug } from "../utils/slug";
import * as productsApi from "../services/shopProductsApi";

function mapProductFromApi(p) {
  const id = String(p?._id ?? p?.id ?? "");
  const title =
    p?.title ??
    p?.name_en ??
    p?.name ??
    "";

  const img =
    p?.img ??
    p?.mainImage ??
    (Array.isArray(p?.gallery) ? p.gallery[0] : "") ??
    "";

  const price = Number(p?.price ?? 0) || 0;

  const category = p?.category ?? p?.categoryName ?? "";
  const subCategory = p?.subCategory ?? p?.subCategoryName ?? "";

  return { id, title, img, price, category, subCategory };
}

export default function Store() {
  const { t, i18n } = useTranslation();

  const lang = (i18n.language || "en").split("-")[0];
  const isRTL = lang === "ar" || lang === "ku";

  const { category, subCategory } = useParams();

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        setError("");

        const out = await productsApi.shopListProducts({ page: 1, limit: 500 });
        if (!alive) return;

        const raw = Array.isArray(out?.data) ? out.data : [];
        setAllProducts(raw.map(mapProductFromApi));
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Failed to load products");
        setAllProducts([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const categorySlug = toSlug(p.category);
      const subCategorySlug = toSlug(p.subCategory);

      if (category && categorySlug !== category) return false;
      if (subCategory && subCategorySlug !== subCategory) return false;

      return true;
    });
  }, [allProducts, category, subCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const safePage = currentPage > totalPages ? 1 : currentPage;

  useEffect(() => {
    if (safePage !== currentPage) setCurrentPage(safePage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safePage]);

  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const title = subCategory
    ? t(`subCategories.${category}.${subCategory}`, fromSlug(subCategory))
    : category
    ? t(`categories.${category}`, fromSlug(category))
    : t("nav.store");

  const basePrevIcon = "/arrow-circle-left.svg";
  const baseNextIcon = "/arrow-circle-left2.svg";
  const prevIcon = isRTL ? baseNextIcon : basePrevIcon;
  const nextIcon = isRTL ? basePrevIcon : baseNextIcon;

  return (
    <section className="flex flex-col items-center w-full">
      <Navbar />

      <div className="w-[90%] md:w-full md:mb-20 mx-auto px-2 md:mt-0 mt-20">
        <BreadCrumb category={category} subCategory={subCategory} />

        <h1 className="text-center text-xl font-semibold mb-8 w-full">
          {title}
        </h1>

        {loading ? (
          <p className="text-center text-sm text-gray-500 mb-10">Loading...</p>
        ) : error ? (
          <p className="text-center text-sm text-red-600 mb-10">{error}</p>
        ) : (
          <>
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
                <ProductCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  img={item.img}
                  price={item.price}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mb-20 w-full">
                <button
                  onClick={() =>
                    isRTL
                      ? setCurrentPage((p) => Math.min(p + 1, totalPages))
                      : setCurrentPage((p) => Math.max(p - 1, 1))
                  }
                  disabled={isRTL ? safePage === totalPages : safePage === 1}
                  className="px-3 py-2 border-none disabled:opacity-40"
                  aria-label={t("pagination.prev")}
                  type="button"
                >
                  <img src={prevIcon} alt="prev" />
                </button>

                <div className="hidden sm:flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className="w-9 h-9 border border-[#1C1E1F] rounded-full"
                      type="button"
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <div className="flex sm:hidden">
                  <button
                    className="w-9 h-9 border border-[#1C1E1F] rounded-full"
                    type="button"
                  >
                    {safePage}
                  </button>
                </div>

                <button
                  onClick={() =>
                    isRTL
                      ? setCurrentPage((p) => Math.max(p - 1, 1))
                      : setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={isRTL ? safePage === 1 : safePage === totalPages}
                  className="px-3 py-2 border-none disabled:opacity-40"
                  aria-label={t("pagination.next")}
                  type="button"
                >
                  <img src={nextIcon} alt="next" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </section>
  );
}
