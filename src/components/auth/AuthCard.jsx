export default function AuthCard({ title, children }) {
  return (
    <div className="w-full max-w-[420px] bg-[#ffffff] rounded-[10px] p-6 sm:p-8">
      <h1 className="text-center text-[28px] sm:text-[34px] mb-8">
        {title}
      </h1>
      {children}
    </div>
  );
}
