export default function CategoryCard({ title, img }) {
  return (
    <div className="
      bg-white 
      md:w-[155px] w-[120px] h-[120px] md:h-[155px]
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
        className="absolute sm:w-[132.34px] w-[100px] h-[130px] sm:h-[165.42px] left-5 sm:bottom-16 bottom-10 rotate-[8.77deg]"
      />
      <p className="text-gray-800 sm:text-lg text-[16px] font-serif text-center absolute sm:bottom-8 bottom-4">
        {title}
      </p>
    </div>
  );
}
