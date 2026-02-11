export default function SectionHeader({ title, subtitle, right }) {
  return (
    <div className="mb-4 w-[50%] flex flex-col gap-3 md:flex-row sm:items-center justify-center">
      <div>
        {subtitle && (
          <p className="mb-1 text-sm text-slate-500">{subtitle}</p>
        )}
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          {title}
        </h2>
      </div>

      <div className="flex items-center justify-end gap-2">{right}</div>
    </div>
  );
}
