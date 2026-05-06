import Modal from '../ui/Modal';
import ContentPreview from './ContentPreview';
import StatusBadge from './StatusBadge';
import ScheduleBadge from './ScheduleBadge';
import { formatDate } from '../../utils/helpers';
import { Clock, User, BookOpen, RotateCcw } from 'lucide-react';

export default function ContentDetailModal({ open, onClose, content }) {
  if (!content) return null;

  return (
    <Modal open={open} onClose={onClose} title="Content Details" maxWidth="max-w-2xl">
      <div className="space-y-5">
        <ContentPreview
          fileUrl={content.fileUrl}
          fileName={content.fileName}
          className="w-full h-56"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Title</p>
            <p className="font-semibold text-gray-800 mt-0.5">{content.title}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Subject</p>
            <p className="font-semibold text-gray-800 mt-0.5">{content.subject}</p>
          </div>
        </div>

        {content.description && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Description</p>
            <p className="text-sm text-gray-700 mt-0.5">{content.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4 text-gray-400" />
            <span>{content.teacherName}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <BookOpen className="h-4 w-4 text-gray-400" />
            <span>{content.subject}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{formatDate(content.startTime)} → {formatDate(content.endTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <RotateCcw className="h-4 w-4 text-gray-400" />
            <span>{content.rotationDuration}s rotation</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={content.status} />
          <ScheduleBadge startTime={content.startTime} endTime={content.endTime} />
        </div>

        {content.rejectionReason && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-3">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Rejection Reason</p>
            <p className="text-sm text-red-700">{content.rejectionReason}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
