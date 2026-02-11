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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const product = products.find((p) => String(p.id) === id);

  if (!product) return <p className="text-center mt-20">Product Not Found</p>;

  const images = [product.img];
  const [activeImg] = useState(0);

  return (
    <section className="w-full">
      <Navbar />

      <div className="w-full mx-auto px-4 mt-4">
  <BreadCrumb category={product.category} title={product.title} />

  {/* ✅ موبایل: عکس اول / دسکتاپ: عکس چپ و info راست */}
  <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-start">
    {/* IMAGE */}
    <div className="w-full md:w-[52%]">
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm flex justify-center w-full">
        <img
          src={images[activeImg]}
          alt={product.title}
          className="md:w-full w-[80%] sm:max-w-sm object-contain"
          draggable={false}
        />
      </div>
    </div>

    {/* INFO */}
    <div className=" w-full md:flex-1 min-w-0">
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
