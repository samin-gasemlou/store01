import CategoryCard from "./CategoryCard";
import { categories } from "./data";
import { Link } from "react-router-dom";

export default function HomeCategories() {
  return (
    <section className="w-[95%] flex items-center justify-center py-12 bg-[#F3F4F6] sm:mt-8 mt-2">
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="
            grid 
            grid-cols-2 
            sm:grid-cols-3 
            md:grid-cols-4 
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
