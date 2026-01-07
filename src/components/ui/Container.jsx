export default function Container({
  children,
  noPadding = false,
  className = "",
}) {
  return (
    <div
      className={`
        w-full max-w-7xl mx-auto
        ${noPadding ? "" : "px-6 lg:px-8"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
