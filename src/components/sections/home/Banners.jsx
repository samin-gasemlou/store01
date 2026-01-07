export default function Banners() {
  return (
    <div className="w-full md:mt-12 mt-4 flex flex-col sm:flex-row items-center justify-center md:gap-10 gap-4 md:mb-26 mb-4">

      {/* Banner 1 */}
      <div className="w-full sm:w-[48%] md:h-64 h-48 rounded-3xl overflow-hidden relative">
        <p className="md:top-12 top-4 right-4 absolute font-normal md:text-[38px] text-[25px] leading-[50px] text-black">
          Where Feminine<br /> Power Meets<br /> Luxury
        </p>
        <img src="/banner1.png" className="object-cover w-full h-full" alt="" />
      </div>

      {/* Banner 2 */}
      <div className="w-full sm:w-[48%] md:h-64 h-48 rounded-3xl overflow-hidden relative">
        <p className="md:top-12 top-4 right-4 absolute font-normal md:text-[38px] text-[25px] leading-[50px] text-white">
          Bold Scent<br /> Timeless<br /> Impact
        </p>
        <img src="/benner2.png" className="object-cover w-full h-full" alt="" />
      </div>

    </div>
  );
}
