export default function CategoryCard({ title, img }) {
  return (
    <div
      className="
        bg-white
        w-[98%]
        h-[85px]
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
          w-8
          sm:w-20
          md:w-[90px]
          h-auto
          object-contain
        "
        draggable={false}
      />

      <p className="text-center text-[11px] sm:text-[12px] md:text-[14px] mt-1 w-full line-clamp-1">
        {title}
      </p>
    </div>
  );
}
