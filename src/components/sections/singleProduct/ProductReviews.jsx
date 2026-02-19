import { useEffect, useMemo, useState } from "react";
import { ThumbsUp, ThumbsDown, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as reviewsApi from "../../../services/shopReviewsApi";
import { getShopAccessToken } from "../../../services/shopAuthApi";

function mapReview(r) {
  return {
    id: String(r?._id ?? r?.id ?? ""),
    name: r?.name ?? r?.userName ?? r?.user?.firstName ?? "User",
    avatar: r?.avatar ?? "/user.jpg",
    rating: Number(r?.rating ?? 0) || 0,
    text: r?.text ?? r?.comment ?? r?.content ?? "",
    likes: Number(r?.likes ?? r?.likesCount ?? 0) || 0,
    dislikes: Number(r?.dislikes ?? r?.dislikesCount ?? 0) || 0,
    createdAt: r?.createdAt ?? null,
  };
}

function AuthRequiredModal({ open, onClose, onLogin, onSignup, isRTL, t }) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="close"
      />

      {/* Panel */}
      <div
        className="
          relative
          w-full sm:w-[520px]
          mx-3 sm:mx-4
          bg-white
          rounded-t-3xl sm:rounded-3xl
          shadow-xl
          border border-gray-100
          p-5 sm:p-6
          animate-[fadeInUp_180ms_ease-out]
        "
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="
            absolute top-4
            right-4
            w-9 h-9
            rounded-full
            grid place-items-center
            hover:bg-gray-100
            transition
          "
          aria-label="close modal"
        >
          <X size={18} />
        </button>

        <h4 className="text-[16px] sm:text-[18px] font-semibold text-[#1C1E1F]">
          {t("authRequired.title", { defaultValue: "Login required" })}
        </h4>

        <p className="mt-2 text-[13px] sm:text-[14px] text-gray-600 leading-6">
          {t("authRequired.desc", {
            defaultValue: "To submit a review, please log in or create an account.",
          })}
        </p>

        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onLogin}
            className="
              flex-1
              h-11 sm:h-12
              rounded-xl
              bg-[#2B4168]
              text-white
              font-semibold
              text-[13px] sm:text-[14px]
              hover:brightness-95
              transition
            "
          >
            {t("authRequired.login", { defaultValue: "Login" })}
          </button>

          <button
            type="button"
            onClick={onSignup}
            className="
              flex-1
              h-11 sm:h-12
              rounded-xl
              border border-[#2B4168]
              text-[#2B4168]
              font-semibold
              text-[13px] sm:text-[14px]
              hover:bg-[#2b416812]
              transition
            "
          >
            {t("authRequired.signup", { defaultValue: "Sign up" })}
          </button>
        </div>

        <p className="mt-4 text-[11px] sm:text-[12px] text-gray-400">
          {t("authRequired.note", {
            defaultValue: "You can continue browsing without logging in.",
          })}
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function ProductReviews({ productId }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const lang = (i18n.language || "en").split("-")[0];
  const isRTL = lang === "ar" || lang === "ku";

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false); // فقط برای جلوگیری از دوبار کلیک (UI تغییر نمی‌کنه)

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const out = await reviewsApi.shopListProductReviews(productId, { sort });

        const raw =
          (Array.isArray(out) ? out : null) ||
          (Array.isArray(out?.items) ? out.items : null) ||
          (Array.isArray(out?.data) ? out.data : null) ||
          (Array.isArray(out?.reviews) ? out.reviews : null) ||
          [];

        if (!alive) return;
        setReviews(raw.map(mapReview));
      } catch {
        if (!alive) return;
        setReviews([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [productId, sort]);

  const reviewsWithI18n = useMemo(() => {
    return reviews.map((r) => {
      const idKey = String(r.id);
      const i18nName = t(`single.demoReviews.${idKey}.name`, { defaultValue: r.name });
      const i18nText = t(`single.demoReviews.${idKey}.text`, { defaultValue: r.text });
      return { ...r, name: i18nName, text: i18nText };
    });
  }, [reviews, t]);

  const openAuthModal = () => setAuthModalOpen(true);

  const handleSubmit = async () => {
    // ✅ همیشه یک واکنش مشخص
    if (submitting) return;

    // ✅ productId واقعی لازم است (بک شما ObjectId می‌خواهد)
    if (!productId) {
      alert(t("single.addReview.noProduct", { defaultValue: "Product not found." }));
      return;
    }

    const text = (comment || "").trim();
    if (!text) {
      alert(t("single.addReview.commentsRequired", { defaultValue: "Please write your comment" }));
      return;
    }

    if (!rating) {
      alert(t("single.addReview.ratingRequired", { defaultValue: "Please select rating" }));
      return;
    }

    const token = getShopAccessToken?.();
    if (!token) {
      openAuthModal();
      return;
    }

    const safeName = (name || "").trim() || "User";
    const safeEmail = (email || "").trim();

    // ✅ payload را طوری می‌فرستیم که با بک‌های مختلف بخونه
    const payload = {
      name: safeName,
      email: safeEmail,
      rating,
      text,       // رایج
      comment: text, // بعضی بک‌ها
      content: text, // بعضی بک‌ها
    };

    try {
      setSubmitting(true);

      const created = await reviewsApi.shopCreateProductReview(token, productId, payload);

      const mapped = mapReview(created?.review ?? created);
      if (mapped?.id) {
        setReviews((prev) => [mapped, ...prev]);
      }

      setComment("");
      setName("");
      setEmail("");
      setRating(0);
    } catch (e) {
      const status = e?.status ?? e?.data?.statusCode;
      if (status === 401 || status === 403) {
        openAuthModal();
        return;
      }

      alert(e?.data?.message || e?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const react = async (reviewId, action) => {
    const token = getShopAccessToken?.();
    if (!token) {
      openAuthModal();
      return;
    }

    // optimistic
    setReviews((prev) =>
      prev.map((r) => {
        if (String(r.id) !== String(reviewId)) return r;
        return {
          ...r,
          likes: action === "like" ? r.likes + 1 : r.likes,
          dislikes: action === "dislike" ? r.dislikes + 1 : r.dislikes,
        };
      })
    );

    try {
      await reviewsApi.shopReactReview(token, reviewId, action);
    } catch {
      // rollback
      setReviews((prev) =>
        prev.map((r) => {
          if (String(r.id) !== String(reviewId)) return r;
          return {
            ...r,
            likes: action === "like" ? Math.max(0, r.likes - 1) : r.likes,
            dislikes: action === "dislike" ? Math.max(0, r.dislikes - 1) : r.dislikes,
          };
        })
      );
    }
  };

  return (
    <section className="w-full mx-auto">
      <AuthRequiredModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={() => navigate("/signin")}
        onSignup={() => navigate("/signup")}
        isRTL={isRTL}
        t={t}
      />

      <div
        dir={isRTL ? "rtl" : "ltr"}
        className={`bg-white rounded-3xl ${isRTL ? "text-right" : "text-left"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl text-[#1C1E1F] font-semibold">
            {t("single.reviewsTitle")}
          </h3>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border-[#1C1E1F] border text-[#1C1E1F] rounded-lg w-[110px] px-2 py-1 text-sm"
          >
            <option value="label">{t("single.reviewSort.label")}</option>
            <option value="newest">{t("single.reviewSort.newest")}</option>
            <option value="highest">{t("single.reviewSort.highest")}</option>
          </select>
        </div>

        {/* REVIEWS LIST */}
        <div className="space-y-6 mb-12">
          {!loading &&
            reviewsWithI18n.map((review) => (
              <div
                key={review.id}
                className="bg-white shadow-[0px_0px_31.2px_rgba(0,0,0,0.05)] rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <img
                      src={review.avatar}
                      className="w-10 h-10 rounded-full object-cover"
                      alt=""
                    />

                    <div>
                      <p className="font-medium">{review.name}</p>

                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className={i <= review.rating ? "text-yellow-400" : "text-gray-300"}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center md:flex-row flex-col md:p-0 px-2 gap-2 text-sm">
                    <button
                      onClick={() => react(review.id, "like")}
                      className="flex items-center gap-1 text-green-600"
                      type="button"
                      aria-label={t("single.reactions.like")}
                    >
                      <ThumbsUp size={16} /> {review.likes}
                    </button>

                    <button
                      onClick={() => react(review.id, "dislike")}
                      className="flex items-center gap-1 text-red-500"
                      type="button"
                      aria-label={t("single.reactions.dislike")}
                    >
                      <ThumbsDown size={16} /> {review.dislikes}
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
              </div>
            ))}
        </div>

        {/* ADD REVIEW */}
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium">{t("single.addReview.rating")}:</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setRating(i)}
                  className={i <= rating ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}
                  type="button"
                  aria-label={t("single.addReview.setRating", { value: i })}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">{t("single.addReview.comments")}:</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={`w-full bg-gray-100 rounded-xl p-4 min-h-[120px] resize-none ${
                isRTL ? "text-right" : "text-left"
              }`}
              placeholder={t("single.addReview.commentsPlaceholder")}
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className={`mb-2 text-sm w-full font-medium ${isRTL ? "text-right" : "text-left"}`}>
              {t("single.addReview.name")}
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`bg-gray-100 w-full rounded-xl p-3 ${isRTL ? "text-right" : "text-left"}`}
              placeholder={t("single.addReview.namePlaceholder")}
            />

            <p className={`mb-2 text-sm w-full font-medium ${isRTL ? "text-right" : "text-left"}`}>
              {t("single.addReview.email")}
            </p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`bg-gray-100 w-full rounded-xl p-3 ${isRTL ? "text-right" : "text-left"}`}
              placeholder={t("single.addReview.emailPlaceholder")}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-[#2B4168] text-white md:w-[197px] w-full px-10 py-3 rounded-lg mt-4 hover:opacity-90"
            type="button"
          >
            {t("single.addReview.submit")}
          </button>
        </div>
      </div>
    </section>
  );
}
