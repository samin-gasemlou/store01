import { Link } from "react-router-dom";

export default function CartDropdown({ open, cartItems, onClose }) {
  if (!open) return null;

  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 0;
    return sum + price * qty;
  }, 0);

  return (
    <div
      className="
        absolute
        bottom-14
        left-32
        -translate-x-1/2
        w-[260px]
        bg-white
        rounded-[10px]
        shadow-lg
        p-3
      "
    >
      {cartItems.length === 0 ? (
        <p className="text-[12px] text-gray-500 px-1 py-2">
          Your cart is empty.
        </p>
      ) : (
        <>
          <div className="max-h-[260px] overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2">
                <div className="w-12 h-12 bg-[#F4F5F7] rounded-[10px] flex items-center justify-center overflow-hidden">
                  <img src={item.img} alt="" className="w-10 h-10 object-contain" />
                </div>

                <div className="flex-1">
                  <p className="text-[13px] leading-5">{item.title}</p>
                  <p className="text-[12px] text-gray-500">
                    Qty: {item.qty}
                  </p>
                </div>

                <p className="text-[12px] font-semibold text-[#2A3E63]">
                  {(Number(item.price) || 0).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t mt-2 pt-2 flex items-center justify-between">
            <p className="text-[12px] text-gray-600">Total</p>
            <p className="text-[13px] font-semibold text-[#2A3E63]">
              {total.toLocaleString()} Toman
            </p>
          </div>

          <div className="mt-3 flex gap-2">
            <Link
  to="/checkout"
  onClick={onClose}
  className="
    w-full
    text-center
    rounded-[10px]
    bg-[#2A3E63]
    text-white
    py-2
    text-[13px]
  "
>
  Payment
</Link>

          </div>
        </>
      )}
    </div>
  );
}
