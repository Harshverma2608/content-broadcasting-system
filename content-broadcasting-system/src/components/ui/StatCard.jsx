import SkeletonCard from './SkeletonCard';

const colors = {
  navy:   'bg-[var(--navy-50)] text-[var(--navy-600)]',
  indigo: 'bg-[var(--navy-50)] text-[var(--navy-600)]',
  yellow: 'bg-amber-50 text-amber-600',
  green:  'bg-emerald-50 text-emerald-600',
  red:    'bg-red-50 text-red-500',
  gold:   'bg-[var(--gold-100)] text-[var(--gold-500)]',
};

export default function StatCard({ label, value, icon: Icon, color = 'navy', loading = false }) {
  if (loading) return <SkeletonCard />;

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow">
      <div className={`p-2.5 sm:p-3 rounded-xl shrink-0 ${colors[color] ?? colors.navy}`}>
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[var(--color-muted)] uppercase tracking-wide leading-tight">{label}</p>
        <p className="text-xl sm:text-2xl font-bold text-[var(--navy-800)] mt-0.5 leading-tight" style={{ fontFamily: 'var(--font-oswald)' }}>
          {value ?? '—'}
        </p>
      </div>
    </div>
  );
}
