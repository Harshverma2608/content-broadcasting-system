import { AlertCircle } from 'lucide-react';

export default function ErrorAlert({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
      <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="font-medium">Something went wrong</p>
        <p className="text-sm mt-0.5">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium underline hover:no-underline shrink-0"
        >
          Retry
        </button>
      )}
    </div>
  );
}
