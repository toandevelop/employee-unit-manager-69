
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { Overtime } from "@/types";

interface OvertimeStatusBadgeProps {
  status: Overtime['status'];
}

export function OvertimeStatusBadge({ status }: OvertimeStatusBadgeProps) {
  switch (status) {
    case 'pending':
      return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> Chờ duyệt</Badge>;
    case 'department_approved':
      return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" /> Đã duyệt đơn vị</Badge>;
    case 'approved':
      return <Badge variant="success" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Đã duyệt</Badge>;
    case 'rejected':
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Từ chối</Badge>;
    default:
      return null;
  }
}
