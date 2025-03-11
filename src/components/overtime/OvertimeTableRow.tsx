
import { format, parseISO } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { Overtime, Employee, Department, OvertimeType } from "@/types";
import { OvertimeStatusBadge } from "./OvertimeStatusBadge";
import { OvertimeTableActions } from "./OvertimeTableActions";

interface OvertimeTableRowProps {
  overtime: Overtime;
  employee: Employee | undefined;
  department: Department | undefined;
  overtimeType: OvertimeType | undefined;
  onEdit: (overtime: Overtime) => void;
  onDelete: (id: string) => void;
  onDepartmentApprove: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function OvertimeTableRow({
  overtime,
  employee,
  department,
  overtimeType,
  onEdit,
  onDelete,
  onDepartmentApprove,
  onApprove,
  onReject
}: OvertimeTableRowProps) {
  return (
    <TableRow>
      <TableCell>{employee?.code || "N/A"}</TableCell>
      <TableCell>{employee?.name || "N/A"}</TableCell>
      <TableCell>{department?.name || "N/A"}</TableCell>
      <TableCell>{format(parseISO(overtime.overtimeDate), "dd/MM/yyyy")}</TableCell>
      <TableCell>{overtime.startTime}</TableCell>
      <TableCell>{overtime.endTime}</TableCell>
      <TableCell>{overtime.hours}</TableCell>
      <TableCell>{overtimeType?.name || "N/A"}</TableCell>
      <TableCell>
        <OvertimeStatusBadge status={overtime.status} />
      </TableCell>
      <TableCell className="text-right">
        <OvertimeTableActions
          overtime={overtime}
          onEdit={onEdit}
          onDelete={onDelete}
          onDepartmentApprove={onDepartmentApprove}
          onApprove={onApprove}
          onReject={onReject}
        />
      </TableCell>
    </TableRow>
  );
}
