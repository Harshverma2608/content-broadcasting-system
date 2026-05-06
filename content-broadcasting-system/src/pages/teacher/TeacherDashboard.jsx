import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Upload, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { contentService } from '../../services/content.service';
import { useFetch } from '../../hooks/useFetch';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import ErrorAlert from '../../components/ui/ErrorAlert';
import ContentPreview from '../../components/content/ContentPreview';
import StatusBadge from '../../components/content/StatusBadge';
import { formatDate } from '../../utils/helpers';

export default function TeacherDashboard() {
  const { user } = useAuth();

  const fetchStats = useCallback(
    () => contentService.getTeacherStats(user.id),
    [user.id]
  );
  const fetchContent = useCallback(
    () => contentService.getTeacherContent(user.id),
    [user.id]
  );

  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useFetch(fetchStats, [user.id]);
  const { data: content, loading: contentLoading, error: contentError, refetch: refetchContent } = useFetch(fetchContent, [user.id]);

  const recent = content?.slice(0, 5) ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-indigo-600" />
              Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.name}</p>
          </div>
          <Link
            to="/teacher/upload"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload Content
          </Link>
        </div>

        {/* Stats */}
        <ErrorAlert message={statsError} onRetry={refetchStats} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Uploaded" value={stats?.total} icon={LayoutDashboard} color="indigo" loading={statsLoading} />
          <StatCard label="Pending" value={stats?.pending} icon={Clock} color="yellow" loading={statsLoading} />
          <StatCard label="Approved" value={stats?.approved} icon={CheckCircle} color="green" loading={statsLoading} />
          <StatCard label="Rejected" value={stats?.rejected} icon={XCircle} color="red" loading={statsLoading} />
        </div>

        {/* Recent content */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Recent Content</h2>
            <Link
              to="/teacher/my-content"
              className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <ErrorAlert message={contentError} onRetry={refetchContent} />

          {contentLoading ? (
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
          ) : recent.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Upload className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-gray-500">No content yet</p>
              <p className="text-sm mt-1">Upload your first content to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recent.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <ContentPreview
                    fileUrl={item.fileUrl}
                    fileName={item.fileName}
                    className="h-12 w-16 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.subject} · {formatDate(item.createdAt)}</p>
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
