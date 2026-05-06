import { useCallback, useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { List, Search, Eye, Check, X } from 'lucide-react';
import { contentService } from '../../services/content.service';
import { approvalService } from '../../services/approval.service';
import { useFetch } from '../../hooks/useFetch';
import { usePagination } from '../../hooks/usePagination';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ContentPreview from '../../components/content/ContentPreview';
import StatusBadge from '../../components/content/StatusBadge';
import ScheduleBadge from '../../components/content/ScheduleBadge';
import ContentDetailModal from '../../components/content/ContentDetailModal';
import RejectModal from '../../components/content/RejectModal';
import EmptyState from '../../components/ui/EmptyState';
import ErrorAlert from '../../components/ui/ErrorAlert';
import SkeletonRow from '../../components/ui/SkeletonRow';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/helpers';
import { CONTENT_STATUS } from '../../utils/constants';

export default function AllContent() {
  const [selected, setSelected] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchAll = useCallback(() => contentService.getAllContent(), []);
  const { data: content, loading, error, refetch } = useFetch(fetchAll);

  // Client-side filtering for performance
  const filtered = useMemo(() => {
    let data = content ?? [];
    if (statusFilter !== 'all') data = data.filter((c) => c.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.teacherName.toLowerCase().includes(q)
      );
    }
    return data;
  }, [content, statusFilter, search]);

  const { paginated, page, totalPages, goTo, next, prev, reset } = usePagination(filtered, 20);

  const handleApprove = async (item) => {
    setActionLoading(item.id);
    try {
      await approvalService.approveContent(item.id);
      toast.success(`"${item.title}" approved!`);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectConfirm = async (reason) => {
    if (!rejectTarget) return;
    setRejectLoading(true);
    try {
      await approvalService.rejectContent(rejectTarget.id, reason);
      toast.success(`"${rejectTarget.title}" rejected.`);
      setRejectTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRejectLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <List className="h-6 w-6 text-indigo-600" />
            All Content
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Showing {filtered.length} of {(content ?? []).length} items
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search title, subject, teacher..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); reset(); }}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); reset(); }}
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
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Teacher</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Subject</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Schedule</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Uploaded</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} cols={8} />)
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState
                        title="No content found"
                        description="Try adjusting your search or filters."
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
                        <p className="font-medium text-gray-800 max-w-[150px] truncate">{item.title}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{item.teacherName}</td>
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
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelected(item)}
                            className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors"
                            aria-label="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {item.status === 'pending' && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                loading={actionLoading === item.id}
                                onClick={() => handleApprove(item)}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                disabled={actionLoading === item.id}
                                onClick={() => setRejectTarget(item)}
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-100">
            <Pagination page={page} totalPages={totalPages} onPrev={prev} onNext={next} onGoTo={goTo} />
          </div>
        </div>
      </div>

      <ContentDetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        content={selected}
      />

      <RejectModal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleRejectConfirm}
        loading={rejectLoading}
      />
    </DashboardLayout>
  );
}
