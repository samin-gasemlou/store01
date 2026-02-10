/* eslint-disable react-hooks/rules-of-hooks */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { products } from "../data/products";
import Navbar from "../components/layout/Navbar";
import BreadCrumb from "../components/layout/BreadCrumb";
import Footer from "../components/layout/Footer";
import ProductInfo from "../components/sections/singleProduct/ProductInfo";
import ProductTabs from "../components/sections/singleProduct/ProductTabs";
import RelatedProducts from "../components/sections/singleProduct/RelatedProducts";

export default function SingleProduct() {
  const { id } = useParams();

  // ✅ اسکرول به بالا هنگام تغییر محصول
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [id]);

  const product = products.find(p => String(p.id) === id);

  if (!product) {
    return <p className="text-center mt-20">Product Not Found</p>;
  }

  // فقط یک عکس داریم
  const images = [product.img];
  const [activeImg] = useState(0);

  return (
    <section className="flex flex-col items-center justify-center w-full">
      <Navbar />
      <BreadCrumb category={product.category} title={product.title} />

      <div className="flex md:flex-row flex-col items-center justify-start gap-10 w-full ">

        {/* IMAGE */}
        <div className="flex md:flex-row flex-col items-center justify-start gap-10 w-full max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm flex justify-center w-full h-full">
            <img
              src={images[activeImg]}
              alt={product.title}
              className="w-full h-full max-w-sm object-contain"
            />
          </div>
        </div>

        {/* INFO */}
        <ProductInfo product={product} />
      </div>

      <ProductTabs product={product} />
      

      <RelatedProducts
        currentProductId={product.id}
        currentCategory={product.category}
      />

      <Footer />
    </section>
  );
}
