import { CONTENT_STATUS } from './constants';

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString();
}

export function getStatusColor(status) {
  switch (status) {
    case CONTENT_STATUS.APPROVED:
      return 'bg-green-100 text-green-700';
    case CONTENT_STATUS.REJECTED:
      return 'bg-red-100 text-red-700';
    case CONTENT_STATUS.PENDING:
    default:
      return 'bg-yellow-100 text-yellow-700';
  }
}

export function getScheduleStatus(startTime, endTime) {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (now < start) return 'scheduled';
  if (now > end) return 'expired';
  return 'active';
}

export function getScheduleStatusColor(scheduleStatus) {
  switch (scheduleStatus) {
    case 'active':
      return 'bg-blue-100 text-blue-700';
    case 'scheduled':
      return 'bg-purple-100 text-purple-700';
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
