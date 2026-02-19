import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { shopGetNavCategories } from "../../services/shopCategoriesApi";

export default function ProductsDropdown() {
  const [open, setOpen] = useState(false);
  const [cats, setCats] = useState([]); // ✅ از بک
  const { t, i18n } = useTranslation();

  const close = () => setOpen(false);

  const lang = (i18n.language || "en").split("-")[0];
  const isRTL = lang === "ar" || lang === "ku";

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        const data = await shopGetNavCategories({ lang });
        if (!alive) return;
        setCats(Array.isArray(data) ? data : []);
      } catch {
        if (!alive) return;
        setCats([]);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [lang]);

  return (
    <div className="relative cursor-pointer">
      <div
        className="flex items-center gap-1"
        onClick={() => setOpen((v) => !v)}
      >
        {t("nav.products")}
      </div>

      <div
        className={`
          absolute top-6 ${isRTL ? "right-0" : "left-0"}
          bg-white shadow-lg rounded-md py-3 w-56 z-50
          transition-all duration-200 ease-out
          ${
            open
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-2 pointer-events-none"
          }
        `}
      >
        {cats.map((cat) => (
          <div key={cat.slug} className="px-4">
            <Link
              to={`/store/${cat.slug}`}
              className="block py-2 font-medium"
              onClick={close}
            >
              {t(`categories.${cat.slug}`, { defaultValue: cat.title })}
            </Link>

            {cat.children?.map((sub) => (
              <Link
                key={sub.slug}
                to={`/store/${cat.slug}/${sub.slug}`}
                className={`block py-1 text-sm ${
                  isRTL ? "pr-4 text-right" : "pl-4 text-left"
                }`}
                onClick={close}
              >
                {t(`subCategories.${cat.slug}.${sub.slug}`, {
                  defaultValue: sub.title,
                })}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
