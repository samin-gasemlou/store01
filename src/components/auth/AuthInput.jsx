export default function AuthInput({ placeholder, type = "text", value, onChange }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
        w-full
        bg-[#ECECEC]
        rounded-[14px]
        px-6
        py-5
        text-[18px]
        outline-none
        placeholder:text-black
      "
    />
  );
}
