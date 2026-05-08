import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No data found',
  description = '',
  icon: Icon = Inbox,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 rounded-full bg-[var(--navy-50)] mb-4">
        <Icon className="h-10 w-10 text-[var(--navy-300)]" />
      </div>
      <p
        className="text-lg font-semibold text-[var(--navy-700)]"
        style={{ fontFamily: 'var(--font-unna)' }}
      >
        {title}
      </p>
      {description && (
        <p className="text-sm mt-1 text-[var(--color-muted)]">{description}</p>
      )}
    </div>
  );
}
