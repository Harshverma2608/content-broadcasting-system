import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { CheckSquare, Check, X, Eye } from 'lucide-react';
import { contentService } from '../../services/content.service';
import { approvalService } from '../../services/approval.service';
import { useFetch } from '../../hooks/useFetch';
import { usePagination } from '../../hooks/usePagination';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ContentPreview from '../../components/content/ContentPreview';
import ContentDetailModal from '../../components/content/ContentDetailModal';
import RejectModal from '../../components/content/RejectModal';
import EmptyState from '../../components/ui/EmptyState';
import ErrorAlert from '../../components/ui/ErrorAlert';
import SkeletonRow from '../../components/ui/SkeletonRow';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/helpers';

const Th = ({ children }) => (
  <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--navy-500)] whitespace-nowrap">
    {children}
  </th>
);

export default function PendingApprovals() {
  const [selected, setSelected]           = useState(null);
  const [rejectTarget, setRejectTarget]   = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  const fetchPending = useCallback(() => contentService.getPendingContent(), []);
  const { data: content, loading, error, refetch } = useFetch(fetchPending);

  const { paginated, page, totalPages, goTo, next, prev } = usePagination(content ?? [], 15);

  const handleApprove = async (item) => {
    setActionLoading(item.id);
    try {
      await approvalService.approveContent(item.id);
      toast.success(`"${item.title}" approved!`);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Approval failed.');
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
      toast.error(err.message || 'Rejection failed.');
    } finally {
      setRejectLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--navy-800)] flex items-center gap-2" style={{ fontFamily: 'var(--font-unna)' }}>
            <CheckSquare className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--navy-400)] shrink-0" />
            Pending Approvals
          </h1>
          <p className="text-sm mt-0.5 text-[var(--color-muted)]">
            {(content ?? []).length} item{(content ?? []).length !== 1 ? 's' : ''} awaiting review
          </p>
        </div>

        <ErrorAlert message={error} onRetry={refetch} />

        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--navy-50)] border-b border-[var(--color-border)]">
                  <Th>Preview</Th>
                  <Th>Title</Th>
                  <Th>Teacher</Th>
                  <Th>Subject</Th>
                  <Th>Submitted</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState title="No pending content" description="All content has been reviewed." icon={CheckSquare} />
                    </td>
                  </tr>
                ) : (
                  paginated.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--navy-50)] transition-colors">
                      <td className="px-4 py-3">
                        <ContentPreview fileUrl={item.fileUrl} fileName={item.fileName} className="h-10 w-14" />
                      </td>
                      <td className="px-4 py-3 max-w-[160px]">
                        <p className="font-medium text-[var(--navy-800)] truncate">{item.title}</p>
                      </td>
                      <td className="px-4 py-3 text-[var(--navy-600)] whitespace-nowrap">{item.teacherName}</td>
                      <td className="px-4 py-3 text-[var(--navy-600)]">{item.subject}</td>
                      <td className="px-4 py-3 text-xs text-[var(--color-muted)] whitespace-nowrap">{formatDate(item.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelected(item)}
                            className="p-1.5 rounded-lg hover:bg-[var(--navy-100)] text-[var(--navy-300)] hover:text-[var(--navy-600)] transition-colors"
                            aria-label="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <Button variant="success" size="sm" loading={actionLoading === item.id} onClick={() => handleApprove(item)}>
                            <Check className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button variant="danger" size="sm" disabled={actionLoading === item.id} onClick={() => setRejectTarget(item)}>
                            <X className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </div>
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
                  <div key={i} className="p-4 animate-pulse space-y-3">
                    <div className="flex gap-3">
                      <div className="h-14 w-20 bg-[var(--navy-100)] rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-[var(--navy-100)] rounded w-3/4" />
                        <div className="h-3 bg-[var(--navy-50)] rounded w-1/2" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-7 bg-[var(--navy-100)] rounded-lg flex-1" />
                      <div className="h-7 bg-[var(--navy-100)] rounded-lg flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <EmptyState title="No pending content" description="All content has been reviewed." icon={CheckSquare} />
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {paginated.map((item) => (
                  <div key={item.id} className="p-4 space-y-3">
                    <div className="flex gap-3">
                      <ContentPreview fileUrl={item.fileUrl} fileName={item.fileName} className="h-14 w-20 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--navy-800)] text-sm truncate">{item.title}</p>
                        <p className="text-xs text-[var(--color-muted)] mt-0.5">{item.teacherName}</p>
                        <p className="text-xs text-[var(--color-muted)]">{item.subject} · {formatDate(item.createdAt)}</p>
                      </div>
                      <button
                        onClick={() => setSelected(item)}
                        className="p-1.5 rounded-lg hover:bg-[var(--navy-100)] text-[var(--navy-300)] hover:text-[var(--navy-600)] transition-colors self-start shrink-0"
                        aria-label="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        loading={actionLoading === item.id}
                        onClick={() => handleApprove(item)}
                        className="flex-1 justify-center"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={actionLoading === item.id}
                        onClick={() => setRejectTarget(item)}
                        className="flex-1 justify-center"
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </Button>
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
      <RejectModal open={!!rejectTarget} onClose={() => setRejectTarget(null)} onConfirm={handleRejectConfirm} loading={rejectLoading} />
    </DashboardLayout>
  );
}
