export default function Banners() {
  return (
    <div className="w-full md:mt-12 mt-4 flex flex-col sm:flex-row items-center justify-center md:gap-10 gap-4 md:mb-26 mb-4">
      {/* Banner 1 */}
      <div className="w-full sm:w-[48%] md:h-64 h-48 rounded-[10px] overflow-hidden relative">
        <p className="
          absolute
          right-4
          top-4 md:top-12
          font-normal
          text-[18px] sm:text-[22px] md:text-[38px]
          leading-[28px] sm:leading-[34px] md:leading-[50px]
          text-black
        ">
          Where Feminine<br /> Power Meets<br /> Luxury
        </p>
        <img
          src="/banner1.png"
          className="object-cover w-full h-full"
          alt=""
        />
      </div>

      {/* Banner 2 */}
      <div className="w-full sm:w-[48%] md:h-64 h-48 rounded-[10px] overflow-hidden relative">
        <p className="
          absolute
          right-4
          top-4 md:top-12
          font-normal
          text-[18px] sm:text-[22px] md:text-[38px]
          leading-[28px] sm:leading-[34px] md:leading-[50px]
          text-white
        ">
          Bold Scent<br /> Timeless<br /> Impact
        </p>
        <img
          src="/benner2.png"
          className="object-cover w-full h-full"
          alt=""
        />
      </div>
    </div>
  );
}
