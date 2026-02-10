export default function CategoryCard({ title, img }) {
  return (
    <div
      className="
        bg-white
        md:w-[185px] w-full
        max-w-40
        h-[120px] md:h-[185px]
        rounded-[5px]
        shadow-sm
        flex flex-col items-center
        justify-end
        p-4
      "
    >
      <img
        src={img}
        alt={title}
        className="
          w-[50px] sm:w-[100px] md:w-[120px]
          h-auto
          object-contain
        "
      />

      <p className="text-center text-[11px] md:text-[14px] mt-0 w-full">
        {title}
      </p>
    </div>
  );
}
