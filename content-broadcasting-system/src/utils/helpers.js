import { CONTENT_STATUS } from './constants';

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString();
}

/* ── Status badge colors (navy palette) ─────────────────────── */
export function getStatusColor(status) {
  switch (status) {
    case CONTENT_STATUS.APPROVED:
      return 'bg-emerald-100 text-emerald-700';
    case CONTENT_STATUS.REJECTED:
      return 'bg-red-100 text-red-700';
    case CONTENT_STATUS.PENDING:
    default:
      return 'bg-amber-100 text-amber-700';
  }
}

/* ── Schedule badge colors (navy palette) ───────────────────── */
export function getScheduleStatus(startTime, endTime) {
  const now   = new Date();
  const start = new Date(startTime);
  const end   = new Date(endTime);
  if (now < start) return 'scheduled';
  if (now > end)   return 'expired';
  return 'active';
}

export function getScheduleStatusColor(scheduleStatus) {
  switch (scheduleStatus) {
    case 'active':
      return 'bg-emerald-100 text-emerald-700';
    case 'scheduled':
      return 'bg-amber-100 text-amber-700';
    case 'expired':
      return 'bg-gray-100 text-gray-500';
    default:
      return 'bg-gray-100 text-gray-500';
  }
}

export function safeGet(obj, path, fallback = null) {
  try {
    return path.split('.').reduce((acc, key) => acc[key], obj) ?? fallback;
  } catch {
    return fallback;
  }
}
