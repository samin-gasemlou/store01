export default function ProductDescription() {
  return (
    <section className="w-[90%] mx-auto px-4 mt-12 mb-16">
      <div className="bg-white rounded-3xl p-6 sm:p-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* TEXT */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">
              Description
            </h3>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquaLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquaLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquaLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
            </p>
          </div>

          {/* IMAGE */}
          <div className="w-full flex justify-center md:justify-end">
            <img
              src="/desc.png"
              alt="Product description"
              className="
                w-full 
                max-w-sm 
                sm:max-w-md 
                rounded-3xl 
                object-cover
              "
            />
          </div>

        </div>

      </div>
    </section>
  );
}
