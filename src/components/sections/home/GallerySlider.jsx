export default function GallerySlider() {
  return (
    <section className="w-full py-10 bg-[#F2F3F5]">
      <div className="max-w-7xl mx-auto px-4">

        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            gap-5
          "
        >
          {/* Image 1 */}
          <img
            src="/g1.png"
            alt=""
            className="w-full h-[250px] sm:h-[280px] md:h-80 rounded-3xl object-cover"
          />

          {/* Image 2 */}
          <img
            src="/g2.png"
            alt=""
            className="w-full h-[250px] sm:h-[280px] md:h-80 rounded-3xl object-cover"
          />

          {/* Image 3 */}
          <img
            src="/g3.png"
            alt=""
            className="w-full h-[250px] sm:h-[280px] md:h-80 rounded-3xl object-cover"
          />

          {/* Image 4 */}
          <img
            src="/g4.png"
            alt=""
            className="w-full h-[250px] sm:h-[280px] md:h-80 rounded-3xl object-cover"
          />
        </div>

      </div>
    </section>
  );
}
