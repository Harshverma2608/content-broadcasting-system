import { memo } from 'react';
import Badge from '../ui/Badge';
import { getStatusColor } from '../../utils/helpers';

const StatusBadge = memo(function StatusBadge({ status }) {
  return <Badge label={status} className={getStatusColor(status)} />;
});

export default StatusBadge;
