import { Link } from "react-router-dom";
import { fromSlug } from "../../utils/slug";

export default function BreadCrumb({ category, subCategory }) {
  return (
    <nav className="text-[12px] text-gray-500 mb-8 w-full flex items-center justify-center md:justify-start">
      <Link to="/" className="hover:text-black">Home</Link>
      <span className="md:mx-2 mx-1">›</span>

      <Link to="/store" className="hover:text-black">Store</Link>

      {category && (
        <>
          <span className="md:mx-2 mx-1">›</span>
          <Link
            to={`/store/${category}`}
            className="hover:text-black capitalize"
          >
            {fromSlug(category)}
          </Link>
        </>
      )}

      {subCategory && (
        <>
          <span className="md:mx-2 mx-1">›</span>
          <span className="text-black font-medium capitalize">
            {fromSlug(subCategory)}
          </span>
        </>
      )}
    </nav>
  );
}
