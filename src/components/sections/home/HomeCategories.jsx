import CategoryCard from "./CategoryCard";
import { categories } from "./data";
import { Link } from "react-router-dom";

export default function HomeCategories() {
  return (
    <section className="w-full flex items-center justify-center md:py-12 py-8 bg-[#F2F3F5] sm:mt-8 md:mb-16 mb-0">
      <div className="w-full mx-auto px-4">
        <div
          className="
            md:flex md:flex-row md:items-center md:justify-between md:gap-2
            grid 
            grid-cols-2 
            sm:grid-cols-3 
            lg:grid-cols-5 
            sm:gap-6 gap-8
          "
        >
          {categories.map((item) => (
            <Link
              key={item.id}
              to={`/store/${encodeURIComponent(item.title)}`}
            >
              <CategoryCard {...item} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
