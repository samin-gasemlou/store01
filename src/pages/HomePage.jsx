import Hero from "../components/sections/home/Hero"
import HomeCategories from "../components/sections/home/HomeCategories"
import Banners from "../components/sections/home/Banners"
import WomenCollection from "../components/sections/home/WomenCollection"
import Recommend from "../components/sections/home/Recommend"
import BannerSection from "../components/sections/home/BannerSection"
import Navbar from "../components/layout/Navbar"
import SponsorSlider from "../components/sections/home/SponsorSlider"
import Footer from "../components/layout/Footer"
import DiscountSection from "../components/sections/home/DiscountSection"
import ProductCarousel from "../components/common/ProductCarousel"
import { products } from "../data/products"
import { api } from "../api/client"; // مسیرش رو درست کن
import { useEffect, useState } from "react";

function HomePage() {


   const [, setItems] = useState([]);
  const [, setErr] = useState("");

  useEffect(() => {
    api("/products")
      .then((res) => {
        // اگر خروجی‌ات {items:[]} بود اینو تغییر بده
        setItems(res.items || res);
      })
      .catch((e) => setErr(e.message));
  }, []);



  return (
  
   <div  className={`flex items-center justify-center flex-col w-full`}>
    <Navbar />
    <Hero/>
    <HomeCategories/>
    <ProductCarousel 
      items={products}
      baseCount={4}
      mobileStep={2}
      desktopStep={5}
      imageSrc="/menn.png" />
    <Banners />
    <DiscountSection />
    <WomenCollection />
    <Recommend />
    <BannerSection />
    <SponsorSlider />
    <Footer />
   </div>
  )
}

export default HomePage
