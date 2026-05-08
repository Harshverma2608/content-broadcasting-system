export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 animate-pulse">
      <div className="h-4 bg-[var(--navy-100)] rounded w-1/3 mb-3" />
      <div className="h-8 bg-[var(--navy-100)] rounded w-1/2 mb-2" />
      <div className="h-3 bg-[var(--navy-50)] rounded w-2/3" />
    </div>
  );
}
