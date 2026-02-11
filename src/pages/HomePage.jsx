import Hero from "../components/sections/home/Hero"
import HomeCategories from "../components/sections/home/HomeCategories"
import MenCollection from "../components/sections/home/MenCollection"
import Banners from "../components/sections/home/Banners"
import WomenCollection from "../components/sections/home/WomenCollection"
import Recommend from "../components/sections/home/Recommend"
import BannerSection from "../components/sections/home/BannerSection"
import Navbar from "../components/layout/Navbar"
import SponsorSlider from "../components/sections/home/SponsorSlider"
import Footer from "../components/layout/Footer"
import DiscountSection from "../components/sections/home/DiscountSection"

function HomePage() {

  return (
  
   <div  className={`flex items-center justify-center flex-col w-full`}>
    <Navbar />
    <Hero/>
    <HomeCategories/>
    <MenCollection />
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
