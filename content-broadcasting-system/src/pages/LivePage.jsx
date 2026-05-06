import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Radio, RefreshCw, Tv, Clock, BookOpen } from 'lucide-react';
import { contentService } from '../services/content.service';
import Spinner from '../components/ui/Spinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import ScheduleBadge from '../components/content/ScheduleBadge';
import { formatDate } from '../utils/helpers';

const POLL_INTERVAL = 30000; // 30 seconds

export default function LivePage() {
  const { teacherId } = useParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
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

  // Initial load
  useEffect(() => {
    fetchLive();
  }, [fetchLive]);
  // Auto-polling
  useEffect(() => {
    const interval = setInterval(() => fetchLive(true), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchLive]);

  // Content rotation
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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Radio className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">ContentBroadcast</h1>
              <p className="text-xs text-gray-400">Live Educational Content</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {content.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                LIVE
              </div>
            )}
            <button
              onClick={() => fetchLive(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <span className="text-xs text-gray-500">
              Updated {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Spinner size="lg" className="border-gray-700 border-t-indigo-500" />
            <p className="text-gray-400">Loading live content...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto mt-20">
            <ErrorAlert message={error} onRetry={() => fetchLive()} />
          </div>
        ) : content.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Tv className="h-16 w-16 text-gray-700 mb-4" />
            <h2 className="text-xl font-semibold text-gray-300">No content available</h2>
            <p className="text-gray-500 mt-2 text-sm text-center max-w-sm">
              There is no active broadcast at this time. Check back later.
            </p>
            <p className="text-xs text-gray-600 mt-4">Auto-refreshes every 30 seconds</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active content display */}
            {activeContent && (
              <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                {/* Image */}
                <div className="relative">
                  <img
                    key={activeContent.id}
                    src={activeContent.fileUrl}
                    alt={activeContent.title}
                    className="w-full h-[420px] object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Overlay info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <ScheduleBadge startTime={activeContent.startTime} endTime={activeContent.endTime} />
                      <span className="text-xs text-gray-300 bg-black/40 px-2 py-0.5 rounded-full">
                        {activeContent.subject}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{activeContent.title}</h2>
                    {activeContent.description && (
                      <p className="text-gray-300 text-sm mt-1">{activeContent.description}</p>
                    )}
                  </div>

                  {/* Rotation indicator */}
                  {content.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/60 rounded-full px-3 py-1 text-xs text-gray-300">
                      {activeIndex + 1} / {content.length}
                    </div>
                  )}
                </div>

                {/* Details bar */}
                <div className="px-6 py-4 flex flex-wrap gap-4 text-sm text-gray-400 border-t border-gray-800">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    <span>{activeContent.subject}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(activeContent.startTime)} → {formatDate(activeContent.endTime)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="h-4 w-4" />
                    <span>Rotates every {activeContent.rotationDuration}s</span>
                  </div>
                </div>
              </div>
            )}

            {/* Content thumbnails */}
            {content.length > 1 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  All Active Content ({content.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {content.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveIndex(idx)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                        idx === activeIndex
                          ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                          : 'border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <img
                        src={item.fileUrl}
                        alt={item.title}
                        className="w-full h-24 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <p className="absolute bottom-1.5 left-2 right-2 text-xs text-white font-medium truncate">
                        {item.title}
                      </p>
                      {idx === activeIndex && (
                        <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
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
