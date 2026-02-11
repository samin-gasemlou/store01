export default function Container({ className = "", children }) {
  return (
    <div className={`mx-auto w-full  px-1 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
