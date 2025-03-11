
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Edit, Trash2, XCircle } from "lucide-react";
import { Overtime } from "@/types";

interface OvertimeTableActionsProps {
  overtime: Overtime;
  onEdit: (overtime: Overtime) => void;
  onDelete: (id: string) => void;
  onDepartmentApprove: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function OvertimeTableActions({
  overtime,
  onEdit,
  onDelete,
  onDepartmentApprove,
  onApprove,
  onReject
}: OvertimeTableActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      {overtime.status === 'pending' && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDepartmentApprove(overtime.id)}
            title="Duyệt đơn vị"
          >
            <AlertCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(overtime)}
            title="Chỉnh sửa"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(overtime.id)}
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
      
      {overtime.status === 'department_approved' && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onApprove(overtime.id)}
            title="Phê duyệt"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onReject(overtime.id)}
            title="Từ chối"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
