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

export default function PendingApprovals() {
  const [selected, setSelected] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // contentId
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-indigo-600" />
            Pending Approvals
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {(content ?? []).length} item{(content ?? []).length !== 1 ? 's' : ''} awaiting review
          </p>
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
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Submitted</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        title="No pending content"
                        description="All content has been reviewed."
                        icon={CheckSquare}
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
                        <p className="font-medium text-gray-800 max-w-[160px] truncate">{item.title}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{item.teacherName}</td>
                      <td className="px-4 py-3 text-gray-600">{item.subject}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelected(item)}
                            className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors"
                            aria-label="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <Button
                            variant="success"
                            size="sm"
                            loading={actionLoading === item.id}
                            onClick={() => handleApprove(item)}
                          >
                            <Check className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            disabled={actionLoading === item.id}
                            onClick={() => setRejectTarget(item)}
                          >
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
