import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Radio, RefreshCw, Tv, Clock, BookOpen } from 'lucide-react';
import { contentService } from '../services/content.service';
import ScheduleBadge from '../components/content/ScheduleBadge';
import { formatDate } from '../utils/helpers';

const POLL_INTERVAL = 30000;

function LiveSpinner() {
  return (
    <div
      className="animate-spin rounded-full border-2 h-10 w-10"
      style={{ borderColor: '#3d3830', borderTopColor: '#d97706' }}
      role="status"
      aria-label="Loading"
    />
  );
}

export default function LivePage() {
  const { teacherId } = useParams();
  const [content, setContent]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing]   = useState(false);
  const rotationRef = useRef(null);

  const fetchLive = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const data = await contentService.getLiveContent(teacherId);
      setContent(data);
      setActiveIndex(0);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message || 'Failed to load live content.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [teacherId]);

  useEffect(() => { fetchLive(); }, [fetchLive]);

  useEffect(() => {
    const interval = setInterval(() => fetchLive(true), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchLive]);

  useEffect(() => {
    if (content.length <= 1) return;
    const active = content[activeIndex];
    const duration = (active?.rotationDuration ?? 30) * 1000;
    rotationRef.current = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % content.length);
    }, duration);
    return () => clearTimeout(rotationRef.current);
  }, [content, activeIndex]);

  const activeContent = content[activeIndex];

  return (
    <div className="min-h-screen" style={{ background: 'var(--live-bg)', color: 'var(--live-text)', fontFamily: 'var(--font-geist)' }}>
      <header style={{ borderBottom: '1px solid var(--live-border)', background: 'var(--live-surface)' }} className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: '#2a2520' }}>
              <Radio className="h-5 w-5" style={{ color: 'var(--live-amber)' }} />
            </div>
            <div>
              <h1 className="font-bold text-lg" style={{ fontFamily: 'var(--font-oswald)', color: 'var(--live-text)' }}>
                ContentBroadcast
              </h1>
              <p className="text-xs" style={{ color: 'var(--live-muted)' }}>Live Educational Content</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {content.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--live-sage)' }}>
                <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: 'var(--live-sage)' }} />
                LIVE
              </div>
            )}
            <button
              onClick={() => fetchLive(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs transition-opacity disabled:opacity-40"
              style={{ color: 'var(--live-muted)' }}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <span className="text-xs" style={{ color: 'var(--live-muted)' }}>
              {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LiveSpinner />
            <p style={{ color: 'var(--live-muted)' }}>Loading live content...</p>
          </div>

        ) : error ? (
          <div className="max-w-md mx-auto mt-20 rounded-xl border p-5" style={{ background: 'var(--live-surface)', borderColor: '#7f1d1d' }}>
            <p className="font-semibold text-red-400 mb-1">Something went wrong</p>
            <p className="text-sm" style={{ color: 'var(--live-muted)' }}>{error}</p>
            <button
              onClick={() => fetchLive()}
              className="mt-3 text-sm font-medium underline"
              style={{ color: 'var(--live-amber)' }}
            >
              Try again
            </button>
          </div>

        ) : content.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Tv className="h-14 w-14 mb-4" style={{ color: '#3d3830' }} />
            <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-unna)', color: '#a09080' }}>
              No content available
            </h2>
            <p className="mt-2 text-sm text-center max-w-sm" style={{ color: 'var(--live-muted)' }}>
              There is no active broadcast at this time. Check back later.
            </p>
            <p className="text-xs mt-4" style={{ color: '#3d3830' }}>Auto-refreshes every 30 seconds</p>
          </div>

        ) : (
          <div className="space-y-8">
            {activeContent && (
              <div className="rounded-2xl overflow-hidden border shadow-2xl" style={{ background: 'var(--live-surface)', borderColor: 'var(--live-border)' }}>
                <div className="relative">
                  <img
                    key={activeContent.id}
                    src={activeContent.fileUrl}
                    alt={activeContent.title}
                    className="w-full h-[420px] object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <ScheduleBadge startTime={activeContent.startTime} endTime={activeContent.endTime} />
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(217,119,6,0.2)', color: 'var(--live-amber-lt)', border: '1px solid rgba(217,119,6,0.3)' }}
                      >
                        {activeContent.subject}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-unna)' }}>
                      {activeContent.title}
                    </h2>
                    {activeContent.description && (
                      <p className="text-sm mt-1" style={{ color: '#c4b8a8' }}>{activeContent.description}</p>
                    )}
                  </div>

                  {content.length > 1 && (
                    <div
                      className="absolute top-4 right-4 rounded-full px-3 py-1 text-xs"
                      style={{ background: 'rgba(0,0,0,0.65)', color: '#c4b8a8' }}
                    >
                      {activeIndex + 1} / {content.length}
                    </div>
                  )}
                </div>

                <div
                  className="px-6 py-4 flex flex-wrap gap-5 text-sm border-t"
                  style={{ borderColor: 'var(--live-border)', color: 'var(--live-muted)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" style={{ color: 'var(--live-amber)' }} />
                    <span>{activeContent.subject}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" style={{ color: 'var(--live-amber)' }} />
                    <span>{formatDate(activeContent.startTime)} → {formatDate(activeContent.endTime)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="h-4 w-4" style={{ color: 'var(--live-amber)' }} />
                    <span>Rotates every {activeContent.rotationDuration}s</span>
                  </div>
                </div>
              </div>
            )}

            {content.length > 1 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--live-muted)' }}>
                  All Active Content ({content.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {content.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveIndex(idx)}
                      className="relative rounded-xl overflow-hidden border-2 transition-all"
                      style={{
                        borderColor: idx === activeIndex ? 'var(--live-amber)' : 'var(--live-border)',
                        boxShadow: idx === activeIndex ? '0 0 0 3px rgba(217,119,6,0.2)' : 'none',
                      }}
                    >
                      <img src={item.fileUrl} alt={item.title} className="w-full h-24 object-cover" loading="lazy" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }} />
                      <p className="absolute bottom-1.5 left-2 right-2 text-xs text-white font-medium truncate">
                        {item.title}
                      </p>
                      {idx === activeIndex && (
                        <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full animate-pulse" style={{ background: 'var(--live-sage)' }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
