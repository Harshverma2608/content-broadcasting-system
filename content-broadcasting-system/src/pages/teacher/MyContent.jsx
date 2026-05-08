import { useCallback, useState } from 'react';
import { FileText, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { contentService } from '../../services/content.service';
import { useFetch } from '../../hooks/useFetch';
import { usePagination } from '../../hooks/usePagination';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ContentPreview from '../../components/content/ContentPreview';
import StatusBadge from '../../components/content/StatusBadge';
import ScheduleBadge from '../../components/content/ScheduleBadge';
import ContentDetailModal from '../../components/content/ContentDetailModal';
import EmptyState from '../../components/ui/EmptyState';
import ErrorAlert from '../../components/ui/ErrorAlert';
import SkeletonRow from '../../components/ui/SkeletonRow';
import Pagination from '../../components/ui/Pagination';
import { formatDate } from '../../utils/helpers';
import { CONTENT_STATUS } from '../../utils/constants';

const Th = ({ children }) => (
  <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--navy-500)] whitespace-nowrap">
    {children}
  </th>
);

export default function MyContent() {
  const { user } = useAuth();
  const [selected, setSelected]         = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchContent = useCallback(() => contentService.getTeacherContent(user.id), [user.id]);
  const { data: content, loading, error, refetch } = useFetch(fetchContent);

  const filtered = (content ?? []).filter((c) => statusFilter === 'all' || c.status === statusFilter);
  const { paginated, page, totalPages, goTo, next, prev } = usePagination(filtered, 15);

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--navy-800)] flex items-center gap-2" style={{ fontFamily: 'var(--font-unna)' }}>
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--navy-400)] shrink-0" />
              My Content
            </h1>
            <p className="text-sm mt-0.5 text-[var(--color-muted)]">
              {filtered.length} item{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); goTo(1); }}
            className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm bg-white text-[var(--navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--navy-400)]"
          >
            <option value="all">All Status</option>
            {Object.values(CONTENT_STATUS).map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
        </div>

        <ErrorAlert message={error} onRetry={refetch} />

        {/* Desktop table / Mobile cards */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--navy-50)] border-b border-[var(--color-border)]">
                  <Th>Preview</Th>
                  <Th>Title</Th>
                  <Th>Subject</Th>
                  <Th>Status</Th>
                  <Th>Schedule</Th>
                  <Th>Uploaded</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState
                        title="No content found"
                        description={statusFilter !== 'all' ? 'Try changing the filter.' : 'Upload your first content to get started.'}
                      />
                    </td>
                  </tr>
                ) : (
                  paginated.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--navy-50)] transition-colors">
                      <td className="px-4 py-3">
                        <ContentPreview fileUrl={item.fileUrl} fileName={item.fileName} className="h-10 w-14" />
                      </td>
                      <td className="px-4 py-3 max-w-[180px]">
                        <p className="font-medium text-[var(--navy-800)] truncate">{item.title}</p>
                        {item.rejectionReason && (
                          <p className="text-xs text-red-500 mt-0.5 truncate">↳ {item.rejectionReason}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[var(--navy-600)] whitespace-nowrap">{item.subject}</td>
                      <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                      <td className="px-4 py-3"><ScheduleBadge startTime={item.startTime} endTime={item.endTime} /></td>
                      <td className="px-4 py-3 text-xs text-[var(--color-muted)] whitespace-nowrap">{formatDate(item.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(item)}
                          className="p-1.5 rounded-lg hover:bg-[var(--navy-100)] text-[var(--navy-300)] hover:text-[var(--navy-600)] transition-colors"
                          aria-label="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden">
            {loading ? (
              <div className="divide-y divide-[var(--color-border)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 animate-pulse space-y-2">
                    <div className="flex gap-3">
                      <div className="h-14 w-20 bg-[var(--navy-100)] rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-[var(--navy-100)] rounded w-3/4" />
                        <div className="h-3 bg-[var(--navy-50)] rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <EmptyState
                title="No content found"
                description={statusFilter !== 'all' ? 'Try changing the filter.' : 'Upload your first content to get started.'}
              />
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {paginated.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-[var(--navy-50)] transition-colors">
                    <div className="flex gap-3">
                      <ContentPreview fileUrl={item.fileUrl} fileName={item.fileName} className="h-14 w-20 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--navy-800)] text-sm truncate">{item.title}</p>
                        <p className="text-xs text-[var(--color-muted)] mt-0.5">{item.subject}</p>
                        {item.rejectionReason && (
                          <p className="text-xs text-red-500 mt-0.5 truncate">↳ {item.rejectionReason}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <StatusBadge status={item.status} />
                          <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
                        </div>
                        <p className="text-xs text-[var(--color-muted)] mt-1">{formatDate(item.createdAt)}</p>
                      </div>
                      <button
                        onClick={() => setSelected(item)}
                        className="p-1.5 rounded-lg hover:bg-[var(--navy-100)] text-[var(--navy-300)] hover:text-[var(--navy-600)] transition-colors self-start shrink-0"
                        aria-label="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-[var(--color-border)]">
            <Pagination page={page} totalPages={totalPages} onPrev={prev} onNext={next} onGoTo={goTo} />
          </div>
        </div>
      </div>

      <ContentDetailModal open={!!selected} onClose={() => setSelected(null)} content={selected} />
    </DashboardLayout>
  );
}
