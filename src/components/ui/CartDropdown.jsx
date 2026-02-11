import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CartDropdown({ open, cartItems, onClose, align = "left" }) {
  const { t } = useTranslation();

  if (!open) return null;

  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 0;
    return sum + price * qty;
  }, 0);

  return (
    <div
      className={`
        absolute
        bottom-14 ${align === "right" ? "right-0" : "left-0"}
        w-[260px]
        bg-white
        rounded-[10px]
        shadow-lg
        p-3
      `}
    >
      {cartItems.length === 0 ? (
        <p className="text-[12px] text-gray-500 px-1 py-2">
          {t("cart.empty")}
        </p>
      ) : (
        <>
          <div className="max-h-[260px] overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2">
                <div className="w-12 h-12 bg-[#F4F5F7] rounded-[10px] flex items-center justify-center overflow-hidden">
                  <img
                    src={item.img}
                    alt=""
                    className="w-10 h-10 object-contain"
                    draggable={false}
                  />
                </div>

                <div className="flex-1">
                  <p className="text-[13px] leading-5">{item.title}</p>
                  <p className="text-[12px] text-gray-500">
                    {t("cart.qty")}: {item.qty}
                  </p>
                </div>

                <p className="text-[12px] font-semibold text-[#2A3E63]">
                  {(Number(item.price) || 0).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t mt-2 pt-2 flex items-center justify-between">
            <p className="text-[12px] text-gray-600">{t("cart.total")}</p>
            <p className="text-[13px] font-semibold text-[#2A3E63]">
              {total.toLocaleString()} {t("cart.currency")}
            </p>
          </div>

          <div className="mt-3">
            <Link
              to="/checkout"
              onClick={onClose}
              className="
                w-full block text-center
                rounded-[10px]
                bg-[#2A3E63]
                text-white
                py-2
                text-[13px]
              "
            >
              {t("cart.payment")}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
