import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Clock, CheckCircle, XCircle, ArrowRight, FileStack } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { contentService } from '../../services/content.service';
import { useFetch } from '../../hooks/useFetch';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import ErrorAlert from '../../components/ui/ErrorAlert';
import StatusBadge from '../../components/content/StatusBadge';
import ContentPreview from '../../components/content/ContentPreview';
import { formatDate } from '../../utils/helpers';

export default function PrincipalDashboard() {
  const { user } = useAuth();

  const fetchStats = useCallback(() => contentService.getStats(), []);
  const fetchPending = useCallback(() => contentService.getPendingContent(), []);

  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useFetch(fetchStats);
  const { data: pending, loading: pendingLoading, error: pendingError, refetch: refetchPending } = useFetch(fetchPending);

  const recentPending = pending?.slice(0, 5) ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-indigo-600" />
            Principal Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.name}</p>
        </div>

        {/* Stats */}
        <ErrorAlert message={statsError} onRetry={refetchStats} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Content" value={stats?.total} icon={FileStack} color="indigo" loading={statsLoading} />
          <StatCard label="Pending" value={stats?.pending} icon={Clock} color="yellow" loading={statsLoading} />
          <StatCard label="Approved" value={stats?.approved} icon={CheckCircle} color="green" loading={statsLoading} />
          <StatCard label="Rejected" value={stats?.rejected} icon={XCircle} color="red" loading={statsLoading} />
        </div>

        {/* Pending approvals */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-800">Pending Approvals</h2>
              {stats?.pending > 0 && (
                <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {stats.pending}
                </span>
              )}
            </div>
            <Link
              to="/principal/pending"
              className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <ErrorAlert message={pendingError} onRetry={refetchPending} />

          {pendingLoading ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                  <div className="h-12 w-16 bg-gray-200 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                </div>
              ))}
            </div>
          ) : recentPending.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <CheckCircle className="h-10 w-10 mx-auto mb-3 text-green-300" />
              <p className="font-medium text-gray-500">All caught up!</p>
              <p className="text-sm mt-1">No pending content to review</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentPending.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <ContentPreview
                    fileUrl={item.fileUrl}
                    fileName={item.fileName}
                    className="h-12 w-16 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.teacherName} · {item.subject} · {formatDate(item.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
