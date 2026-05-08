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

  const fetchStats   = useCallback(() => contentService.getTeacherStats(user.id), [user.id]);
  const fetchContent = useCallback(() => contentService.getTeacherContent(user.id), [user.id]);

  const { data: stats,   loading: statsLoading,   error: statsError,   refetch: refetchStats   } = useFetch(fetchStats);
  const { data: content, loading: contentLoading, error: contentError, refetch: refetchContent } = useFetch(fetchContent);

  const recent = content?.slice(0, 5) ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--navy-800)] flex items-center gap-2" style={{ fontFamily: 'var(--font-unna)' }}>
              <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--navy-400)] shrink-0" />
              Dashboard
            </h1>
            <p className="text-sm mt-0.5 text-[var(--color-muted)]">
              Welcome back,{' '}
              <span style={{ fontFamily: 'var(--font-great)', fontSize: '1.1rem', color: 'var(--navy-600)' }}>
                {user?.name}
              </span>
            </p>
          </div>
          <Link
            to="/teacher/upload"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[var(--navy-700)] hover:bg-[var(--navy-600)] transition-colors shrink-0"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden xs:inline">Upload Content</span>
            <span className="xs:hidden">Upload</span>
          </Link>
        </div>

        <ErrorAlert message={statsError} onRetry={refetchStats} />

        {/* Stats grid — 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard label="Total"    value={stats?.total}    icon={LayoutDashboard} color="navy"   loading={statsLoading} />
          <StatCard label="Pending"  value={stats?.pending}  icon={Clock}           color="yellow" loading={statsLoading} />
          <StatCard label="Approved" value={stats?.approved} icon={CheckCircle}     color="green"  loading={statsLoading} />
          <StatCard label="Rejected" value={stats?.rejected} icon={XCircle}         color="red"    loading={statsLoading} />
        </div>

        {/* Recent content */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[var(--color-border)]">
            <h2 className="font-semibold text-[var(--navy-800)] text-sm sm:text-base" style={{ fontFamily: 'var(--font-unna)' }}>
              Recent Content
            </h2>
            <Link
              to="/teacher/my-content"
              className="text-xs sm:text-sm text-[var(--navy-500)] hover:text-[var(--navy-700)] flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <ErrorAlert message={contentError} onRetry={refetchContent} />

          {contentLoading ? (
            <div className="divide-y divide-[var(--color-border)]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 animate-pulse">
                  <div className="h-10 w-14 bg-[var(--navy-100)] rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="h-3.5 bg-[var(--navy-100)] rounded w-2/5" />
                    <div className="h-3 bg-[var(--navy-50)] rounded w-1/4" />
                  </div>
                  <div className="h-5 w-14 bg-[var(--navy-100)] rounded-full shrink-0" />
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="py-12 text-center">
              <Upload className="h-8 w-8 mx-auto mb-3 text-[var(--navy-200)]" />
              <p className="font-medium text-[var(--navy-600)] text-sm" style={{ fontFamily: 'var(--font-unna)' }}>No content yet</p>
              <p className="text-xs mt-1 text-[var(--color-muted)]">Upload your first content to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {recent.map((item) => (
                <div key={item.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 hover:bg-[var(--navy-50)] transition-colors">
                  <ContentPreview fileUrl={item.fileUrl} fileName={item.fileName} className="h-10 w-14 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--navy-800)] truncate text-sm">{item.title}</p>
                    <p className="text-xs text-[var(--color-muted)] mt-0.5 truncate">{item.subject} · {formatDate(item.createdAt)}</p>
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
