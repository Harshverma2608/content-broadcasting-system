import { memo, useState } from 'react';
import { ImageOff } from 'lucide-react';

const ContentPreview = memo(function ContentPreview({ fileUrl, fileName, className = '' }) {
  const [error, setError] = useState(false);

  if (!fileUrl || error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center text-gray-400 p-4">
          <ImageOff className="h-8 w-8 mx-auto mb-1" />
          <p className="text-xs">Preview unavailable</p>
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
