export default function CategoryCard({ title, img }) {
  return (
    <div
      className="
        bg-white
        w-full
        h-[115px]
        sm:h-[140px]
        md:h-[185px]
        rounded-[5px]
        shadow-sm
        flex flex-col
        items-center
        justify-end
        p-3
        sm:p-4
      "
    >
      <img
        src={img}
        alt={title}
        className="
          w-[55px]
          sm:w-[80px]
          md:w-[110px]
          lg:w-[120px]
          h-auto
          object-contain
        "
      />

      <p className="text-center text-[11px] sm:text-[12px] md:text-[14px] mt-1 w-full">
        {title}
      </p>
    </div>
  );
}
