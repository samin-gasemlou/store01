export default function BannerSection() {
  return (
    <section className="w-full relative md:mt-24 md:mb-26">

      <div className="
        w-full h-full 
        flex flex-col md:flex-row 
        items-center md:items-start 
        justify-between 
        relative
      ">

        {/* LEFT IMAGE + ORANGE BOX */}
        <div className="
          relative 
          w-full md:w-1/2 
          flex justify-center md:justify-start 
          mt-20 md:mt-0
        ">

          {/* Orange BG */}
          <div className="
            absolute bg-[#FF6A3D] 
            w-[700px] h-[230px] 
            rounded-br-3xl rounded-tr-3xl
            top-10 left-1/2 md:left-0 
            -translate-x-1/2 md:translate-x-0
            -z-10
          "></div>

          {/* Main Image */}
          <img 
            src="./perfume.png"
            alt="Perfume"
            className="
              w-[320px] object-contain 
              absolute 
              -top-14 md:-top-14 
              right-1/2 md:right-28 
              translate-x-1/2 md:translate-x-0
            "
          />

          {/* Flower Image */}
          <img 
            src="./fl.png"
            alt="flower"
            className="
              w-[220px] object-contain 
              absolute 
              top-24 
              right-1/2 md:right-60 
              translate-x-1/2 md:translate-x-0 
              -z-10
            "
          />
        </div>

        {/* RIGHT TEXT */}
        <div className="
          w-full md:w-1/2 
          h-[200px] 
          flex flex-col items-center md:items-start 
          justify-center 
          mt-40 md:mt-0 
          relative md:absolute 
          right-0 top-8
        ">

          {/* Right Pattern */}
          <img 
            src="/pattern.svg"
            alt=""
            className="
              absolute 
              right-0 bottom-0 
              w-[190px] 
              opacity-70 
              pointer-events-none 
              hidden md:block
            "
          />

          <h2 className="text-4xl sm:text-5xl font-semibold md:mt-0 mt-32">01 Store</h2>
          <p className="text-gray-600 mt-4 text-sm sm:text-base text-center md:text-left">
            Perfume is not just for smelling good, it's for conveying meaning.
          </p>
        </div>

      </div>
    </section>
  );
}
