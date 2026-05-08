import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPrev, onNext, onGoTo }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-4" style={{ fontFamily: 'var(--font-geist)' }}>
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="p-2 rounded-lg hover:bg-[var(--navy-50)] text-[var(--navy-600)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages[0] > 1 && (
        <>
          <button
            onClick={() => onGoTo(1)}
            className="px-3 py-1.5 rounded-lg text-sm hover:bg-[var(--navy-50)] text-[var(--navy-600)] transition-colors"
          >
            1
          </button>
          {pages[0] > 2 && <span className="px-2 text-[var(--color-muted)]">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onGoTo(p)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            p === page
              ? 'bg-[var(--navy-700)] text-white shadow-sm'
              : 'hover:bg-[var(--navy-50)] text-[var(--navy-700)]'
          }`}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-[var(--color-muted)]">…</span>
          )}
          <button
            onClick={() => onGoTo(totalPages)}
            className="px-3 py-1.5 rounded-lg text-sm hover:bg-[var(--navy-50)] text-[var(--navy-600)] transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="p-2 rounded-lg hover:bg-[var(--navy-50)] text-[var(--navy-600)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
