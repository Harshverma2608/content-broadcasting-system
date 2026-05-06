import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data found', description = '', icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
      <Icon className="h-12 w-12 mb-4 text-gray-300" />
      <p className="text-lg font-medium text-gray-500">{title}</p>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  );
}
