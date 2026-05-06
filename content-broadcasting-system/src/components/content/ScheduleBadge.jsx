import { memo } from 'react';
import Badge from '../ui/Badge';
import { getScheduleStatus, getScheduleStatusColor } from '../../utils/helpers';

const ScheduleBadge = memo(function ScheduleBadge({ startTime, endTime }) {
  const status = getScheduleStatus(startTime, endTime);
  return <Badge label={status} className={getScheduleStatusColor(status)} />;
});

export default ScheduleBadge;
