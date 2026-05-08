import { memo, useState } from 'react';
import { ImageOff } from 'lucide-react';

const ContentPreview = memo(function ContentPreview({ fileUrl, fileName, className = '' }) {
  const [error, setError] = useState(false);

  if (!fileUrl || error) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--navy-50)] rounded-lg border border-[var(--color-border)] ${className}`}
      >
        <div className="text-center text-[var(--navy-300)] p-2">
          <ImageOff className="h-6 w-6 mx-auto mb-0.5" />
          <p className="text-xs">No preview</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={fileUrl}
      alt={fileName || 'Content preview'}
      className={`object-cover rounded-lg ${className}`}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
});

export default ContentPreview;
