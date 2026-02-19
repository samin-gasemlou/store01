import { useEffect, useRef, useState } from "react";
import CategoryCard from "./CategoryCard";
import { categories as localCategories } from "./data";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

// ✅ اتصال به بک (همون فایلی که قبلاً دادم)
import { fetchPublicCategories, slugify } from "../../../services/shopCatalogApi";

export default function HomeCategories() {
  const { t, i18n } = useTranslation();

  const trackRef = useRef(null);
  const itemRefs = useRef([]);

  // ✅ Desktop slider (lg+)
  const desktopTrackRef = useRef(null);

  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : true
  );

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );

  // ✅ دیتای دسته‌بندی از بک (با fallback عکس از لوکال)
  const [categories, setCategories] = useState(() => localCategories || []);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      setIsDesktop(window.innerWidth >= 1024);
      if (!mobile) setActive(0);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollToIndex = (i) => {
    const el = trackRef.current;
    const item = itemRefs.current[i];
    if (!el || !item) return;

    el.scrollTo({
      left: item.offsetLeft,
      behavior: "smooth",
    });
  };

  // ✅ Desktop scroll helpers (بدون تغییر UI موبایل)
  const canDesktopScroll = isDesktop && categories.length > 6;
  const scrollDesktopBy = (dir) => {
    const el = desktopTrackRef.current;
    if (!el) return;
    const amount = Math.max(200, Math.floor(el.clientWidth * 0.85));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  // ✅ دریافت دسته‌بندی‌ها از بک
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const lang = (i18n.language || "en").split("-")[0];

        const res = await fetchPublicCategories({ limit: 200 });
        const data = Array.isArray(res?.data) ? res.data : [];

        // برای اینکه UI نشکنه: عکس‌ها را از لوکال هم map می‌کنیم
        const localBySlug = new Map(
          (localCategories || []).map((c) => [String(c.slug || ""), c])
        );

        const normalized = data
          .map((c) => {
            const title =
              (lang === "ar"
                ? c?.name_ar
                : lang === "ku"
                ? c?.name_kur || c?.name_ku
                : c?.name_en) ||
              c?.name_en ||
              c?.name_ar ||
              c?.name_kur ||
              c?.name_ku ||
              c?.name ||
              "";

            const slug = c?.slug || slugify(c?.name_en || title);
            const local = localBySlug.get(String(slug)) || null;

            // بک ممکنه یکی از این فیلدها رو داشته باشه
            const img =
              c?.img ||
              c?.image ||
              c?.icon ||
              c?.thumbnail ||
              c?.cover ||
              c?.banner ||
              local?.img ||
              "";

            return {
              // HomeCategories از item.id و item.slug و item.titleKey و item.img استفاده می‌کنه
              id: c?._id || c?.id || slug,
              slug,
              // چون t(item.titleKey) بدون defaultValue هست:
              // titleKey را خودِ متن عنوان می‌گذاریم تا همان نمایش داده شود
              titleKey: title || slug,
              img,
            };
          })
          .filter((x) => x?.id && x?.slug);

        if (mounted) {
          // اگر بک خالی بود fallback لوکال را نگه داریم
          setCategories(normalized.length ? normalized : (localCategories || []));
        }
      } catch {
        // در صورت خطا، لوکال را نگه می‌داریم تا UI خراب نشود
        if (mounted) setCategories(localCategories || []);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [i18n.language]);

  // موبایل: 2 کارت همزمان => آخرین ایندکس قابل نمایش = length - 2
  const maxIndex = Math.max(0, categories.length - 2);

  const prev = () => {
    const nextIndex = Math.max(active - 1, 0);
    setActive(nextIndex);
    scrollToIndex(nextIndex);
  };

  const next = () => {
    const nextIndex = Math.min(active + 1, maxIndex);
    setActive(nextIndex);
    scrollToIndex(nextIndex);
  };

  // ✅ sync active با اسکرول/درگ (حرفه‌ای)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      if (!isMobile) return;

      // نزدیک‌ترین کارت به سمت چپ
      let nearest = 0;
      let best = Infinity;

      for (let i = 0; i < itemRefs.current.length; i++) {
        const node = itemRefs.current[i];
        if (!node) continue;
        const d = Math.abs(node.offsetLeft - el.scrollLeft);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }

      // clamp چون 2 کارت همزمان داریم
      const clamped = Math.min(nearest, maxIndex);
      setActive(clamped);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isMobile, maxIndex]);

  return (
    <section className="w-full py-8 md:py-12 sm:mt-8 md:mb-16 relative z-50">
      {/* ✅ فلش‌ها فقط موبایل */}
      {isMobile && categories.length > 2 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full border border-[#1C1E1F] shadow-md sm:hidden"
            aria-label="Previous categories"
            type="button"
          >
            <ChevronLeft size={8} />
          </button>

          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full border border-[#1C1E1F] shadow-md sm:hidden"
            aria-label="Next categories"
            type="button"
          >
            <ChevronRight size={8} />
          </button>
        </>
      )}

      {/* ✅ هم‌عرض با بقیه سکشن‌ها */}
      <div className="w-full mx-auto px-2">
        {/* ✅ MOBILE: اسلایدر واقعی + درگ + بدون اسکرول‌بار */}
        <div
          ref={trackRef}
          className="
            flex
            gap-1.5
            overflow-x-auto
            no-scrollbar
            scroll-smooth
            snap-x snap-mandatory
            sm:hidden
            py-1
          "
        >
          {categories.map((item, i) => (
            <Link
              key={item.id}
              to={`/store/${encodeURIComponent(item.slug)}`}
              ref={(el) => (itemRefs.current[i] = el)}
              className="
                shrink-0
                snap-start
                w-[calc((100%-12px)/3)]
              "
            >
              <CategoryCard title={t(item.titleKey)} img={item.img} />
            </Link>
          ))}
        </div>

        {/* ✅ sm+ : اگر lg+ و تعداد بیشتر از 6 شد، اسکرول افقی با فلش‌ها */}
        {canDesktopScroll ? (
          <div className="hidden lg:block relative">
            <button
              type="button"
              onClick={() => scrollDesktopBy(-1)}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full border border-[#1C1E1F] shadow-md"
              aria-label="Previous categories"
            >
              <ChevronLeft size={14} />
            </button>

            <button
              type="button"
              onClick={() => scrollDesktopBy(1)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full border border-[#1C1E1F] shadow-md"
              aria-label="Next categories"
            >
              <ChevronRight size={14} />
            </button>

            <div
              ref={desktopTrackRef}
              className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth py-1"
            >
              {categories.map((item) => (
                <Link
                  key={item.id}
                  to={`/store/${encodeURIComponent(item.slug)}`}
                  className="shrink-0 w-[calc((100%-40px)/6)]"
                >
                  <CategoryCard title={t(item.titleKey)} img={item.img} />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="
              hidden sm:grid
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-6
              gap-4
              md:gap-6
              lg:gap-8
            "
          >
            {categories.map((item) => (
              <Link
                key={item.id}
                to={`/store/${encodeURIComponent(item.slug)}`}
                className="w-full"
              >
                <CategoryCard title={t(item.titleKey)} img={item.img} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
