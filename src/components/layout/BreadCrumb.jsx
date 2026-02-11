import { Link } from "react-router-dom";
import { fromSlug } from "../../utils/slug";
import { useTranslation } from "react-i18next";

export default function BreadCrumb({ category, subCategory }) {
  const { t } = useTranslation();

  return (
    <nav className="text-[12px]  text-gray-500 mb-8 w-full flex items-center justify-center md:justify-start">
      <Link to="/" className="hover:text-black">
        {t("nav.home")}
      </Link>

      <span className="md:mx-2 mx-1">›</span>

      <Link to="/store" className="hover:text-black">
        {t("nav.store")}
      </Link>

      {category && (
        <>
          <span className="md:mx-2 mx-1">›</span>
          <Link
            to={`/store/${category}`}
            className="hover:text-black capitalize"
          >
            {t(`categories.${category}`, fromSlug(category))}
          </Link>
        </>
      )}

      {subCategory && (
        <>
          <span className="md:mx-2 mx-1">›</span>
          <span className="text-black font-medium capitalize">
            {t(
              `subCategories.${category}.${subCategory}`,
              fromSlug(subCategory)
            )}
          </span>
        </>
      )}
    </nav>
  );
}
