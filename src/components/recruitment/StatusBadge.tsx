
import { Badge } from '@/components/ui/badge';
import { Check, Clock, X, CalendarClock, MessageSquare, UserCheck, AlertTriangle } from 'lucide-react';

type ApplicationStatus = 'new' | 'reviewing' | 'interview' | 'offered' | 'hired' | 'rejected';
type InterviewStatus = 'scheduled' | 'completed' | 'canceled';

type StatusType = 'application' | 'interview';

interface StatusBadgeProps {
  status: ApplicationStatus | InterviewStatus;
  type: StatusType;
}

const StatusBadge = ({ status, type }: StatusBadgeProps) => {
  if (type === 'application') {
    switch (status as ApplicationStatus) {
      case 'new':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Mới</span>
          </Badge>
        );
      case 'reviewing':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>Đang xem xét</span>
          </Badge>
        );
      case 'interview':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
            <CalendarClock className="h-3 w-3" />
            <span>Phỏng vấn</span>
          </Badge>
        );
      case 'offered':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <Check className="h-3 w-3" />
            <span>Đã đề xuất</span>
          </Badge>
        );
      case 'hired':
        return (
          <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200 flex items-center gap-1">
            <UserCheck className="h-3 w-3" />
            <span>Đã tuyển</span>
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <X className="h-3 w-3" />
            <span>Từ chối</span>
          </Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  } else {
    switch (status as InterviewStatus) {
      case 'scheduled':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <CalendarClock className="h-3 w-3" />
            <span>Đã lên lịch</span>
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <Check className="h-3 w-3" />
            <span>Đã hoàn thành</span>
          </Badge>
        );
      case 'canceled':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Đã hủy</span>
          </Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  }
};

export default StatusBadge;
