import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import BreadCrumb from "../components/layout/BreadCrumb";
import Footer from "../components/layout/Footer";
import ProductInfo from "../components/sections/singleProduct/ProductInfo";
import ProductTabs from "../components/sections/singleProduct/ProductTabs";
import RelatedProducts from "../components/sections/singleProduct/RelatedProducts";
import { useTranslation } from "react-i18next";
import * as productsApi from "../services/shopProductsApi";

const API_ORIGIN = "http://localhost:4000";
function fixImageUrl(src) {
  const s = (src ?? "").toString().trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/uploads/")) return `${API_ORIGIN}${s}`;
  return s;
}

function mapProductFromApi(p) {
  if (!p) return null;

  return {
    id: String(p?._id ?? p?.id ?? ""),
    title: p?.name_en ?? p?.title ?? "",
    description:
      p?.description_en ?? p?.description_ar ?? p?.description_kur ?? "",
    img: fixImageUrl(p?.mainImage ?? p?.img ?? ""),
    price: Number(p?.price ?? 0) || 0,

    category: p?.categoryName ?? p?.category ?? "",
    subCategory: p?.subCategoryName ?? p?.subCategory ?? "",
    brand: p?.brandName ?? "",
    code: p?.sku ?? p?.barcode ?? "",
    reviewsCount: Number(p?.reviewsCount ?? 13) || 13,
  };
}

export default function SingleProduct() {
  const { t } = useTranslation();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);

  const productId = String(product?.id || "");
  const title = useMemo(() => {
    const fallback = product?.title || "";
    if (!productId) return fallback;
    return t(`products.${productId}.title`, fallback);
  }, [t, productId, product?.title]);

  const images = useMemo(() => {
    return product?.img ? [product.img] : [];
  }, [product?.img]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        setError("");

        const raw = await productsApi.shopGetProduct(id);
        const mapped = mapProductFromApi(raw);

        if (!alive) return;
        setProduct(mapped);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Failed to load product");
        setProduct(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="w-full flex flex-col items-center">
        <Navbar />
        <p className="text-center mt-20 text-sm text-gray-500">Loading...</p>
        <Footer />
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="w-full flex flex-col items-center">
        <Navbar />
        <p className="text-center mt-20 text-sm text-red-600">
          {error || t("single.notFound")}
        </p>
        <Footer />
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col items-center">
      <Navbar />

      <div className="w-full mx-auto px-4 mt-4">
        <BreadCrumb category={product.category} title={title} />

        <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-start">
          <div className="w-full md:w-[52%]">
            <div className="bg-white rounded-[10px] p-4 sm:p-6 shadow-sm flex justify-center w-full">
              <img
                src={images[0]}
                alt={title}
                className="md:w-full w-[80%] sm:max-w-sm object-contain"
                draggable={false}
              />
            </div>
          </div>

          <div className="w-full md:flex-1 min-w-0">
            <ProductInfo product={product} />
          </div>
        </div>

        <ProductTabs product={product} />
      </div>

      <RelatedProducts
        currentProductId={product.id}
        currentCategory={product.category}
      />

      <Footer />
    </section>
  );
}
