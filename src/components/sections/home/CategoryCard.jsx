export default function CategoryCard({ title, img }) {
  return (
    <div className="
      bg-white 
      md:w-[185px] w-[135px] h-[130px] md:h-[185px]
      rounded-2xl 
      shadow-sm 
      hover:shadow-md 
      transition 
      cursor-pointer 
      flex flex-col items-center 
      relative
      p-6
    ">
      <img 
        src={img} 
        alt={title} 
        className="absolute sm:w-[132.34px] w-[100px] h-[130px] sm:h-[165.42px] sm:bottom-16 -top-10"
      />
      <p className="text-gray-800 sm:text-lg md:text-[16px] text-[14px] font-serif text-center absolute sm:bottom-8 bottom-4">
        {title}
      </p>
    </div>
  );
}
