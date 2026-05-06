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

export default function MyContent() {
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchContent = useCallback(
    () => contentService.getTeacherContent(user.id),
    [user.id]
  );
  const { data: content, loading, error, refetch } = useFetch(fetchContent, [user.id]);

  const filtered = (content ?? []).filter(
    (c) => statusFilter === 'all' || c.status === statusFilter
  );

  const { paginated, page, totalPages, goTo, next, prev } = usePagination(filtered, 15);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-600" />
              My Content
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {filtered.length} item{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); goTo(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="all">All Status</option>
            {Object.values(CONTENT_STATUS).map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
        </div>

        <ErrorAlert message={error} onRetry={refetch} />

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Preview</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Subject</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Schedule</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Uploaded</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
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
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <ContentPreview
                          fileUrl={item.fileUrl}
                          fileName={item.fileName}
                          className="h-10 w-14"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 max-w-[180px] truncate">{item.title}</p>
                        {item.rejectionReason && (
                          <p className="text-xs text-red-500 mt-0.5 max-w-[180px] truncate">
                            ↳ {item.rejectionReason}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{item.subject}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3">
                        <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(item)}
                          className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors"
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

          <div className="px-4 py-3 border-t border-gray-100">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={prev}
              onNext={next}
              onGoTo={goTo}
            />
          </div>
        </div>
      </div>

      <ContentDetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        content={selected}
      />
    </DashboardLayout>
  );
}
