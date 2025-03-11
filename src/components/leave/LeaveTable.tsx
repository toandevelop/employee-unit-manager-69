
import { useState } from "react";
import { format } from "date-fns";
import { useAppStore } from "@/store";
import { Leave } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit, Trash, CheckCircle, XCircle } from "lucide-react";
import { LeaveForm } from "./LeaveForm";
import { toast } from "sonner";
import { LeaveFilters } from "./LeaveFilters";

interface LeaveApprovalProps {
  leave: Leave;
  isOpen: boolean;
  type: 'department' | 'management';
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

// Approval Dialog Component
function LeaveApproval({ leave, isOpen, type, onOpenChange, onApprove, onReject }: LeaveApprovalProps) {
  const [rejectionReason, setRejectionReason] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'department' 
              ? 'Duyệt đơn nghỉ phép (Đơn vị)' 
              : 'Duyệt đơn nghỉ phép (Quản lý)'}
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn duyệt đơn nghỉ phép này không?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Nhân viên:</p>
              <p>{leave.employee?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Ngày bắt đầu:</p>
              <p>{format(new Date(leave.startDate), "dd/MM/yyyy")}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Ngày kết thúc:</p>
              <p>{format(new Date(leave.endDate), "dd/MM/yyyy")}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Số ngày:</p>
              <p>{leave.numberOfDays}</p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <div className="w-full flex flex-col gap-2">
            <p className="text-sm font-medium">Lý do từ chối (nếu từ chối):</p>
            <Input
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
            />
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (!rejectionReason) {
                  toast.error("Vui lòng nhập lý do từ chối");
                  return;
                }
                onReject(rejectionReason);
              }}
            >
              Từ chối
            </Button>
            <Button onClick={onApprove}>
              Duyệt
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: Leave['status'] }) {
  switch (status) {
    case 'pending':
      return <Badge variant="outline">Chờ duyệt</Badge>;
    case 'department_approved':
      return <Badge variant="secondary">Đơn vị đã duyệt</Badge>;
    case 'approved':
      return <Badge variant="success" className="bg-green-500 text-white">Đã duyệt</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Đã từ chối</Badge>;
    default:
      return null;
  }
}

export function LeaveTable() {
  const { 
    leaves, 
    employees, 
    departments, 
    leaveTypes,
    deleteLeave, 
    approveDepartment, 
    approveLeave, 
    rejectLeave 
  } = useAppStore();
  
  const [selectedLeave, setSelectedLeave] = useState<Leave | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [approvalType, setApprovalType] = useState<'department' | 'management'>('department');
  
  const [filters, setFilters] = useState<{
    startDate?: Date;
    endDate?: Date;
    departmentId?: string;
    employeeId?: string;
    filterType: 'custom' | 'week' | 'month' | 'year';
  }>({
    filterType: 'month',
  });

  // Initialize filters for current month
  useState(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setFilters({
      filterType: 'month',
      startDate,
      endDate
    });
  });

  // Filter leaves based on filters
  const filteredLeaves = leaves.filter(leave => {
    const leaveStartDate = new Date(leave.startDate);
    const leaveEndDate = new Date(leave.endDate);
    
    // Filter by date range
    if (filters.startDate && filters.endDate) {
      // Check if leave period overlaps with filter period
      const isInDateRange = (
        (leaveStartDate >= filters.startDate && leaveStartDate <= filters.endDate) ||
        (leaveEndDate >= filters.startDate && leaveEndDate <= filters.endDate) ||
        (leaveStartDate <= filters.startDate && leaveEndDate >= filters.endDate)
      );
      
      if (!isInDateRange) return false;
    }
    
    // Filter by department
    if (filters.departmentId && leave.departmentId !== filters.departmentId) {
      return false;
    }
    
    // Filter by employee
    if (filters.employeeId && leave.employeeId !== filters.employeeId) {
      return false;
    }
    
    return true;
  });

  // Handle edit
  const handleEdit = (leave: Leave) => {
    setSelectedLeave({
      ...leave,
      employee: employees.find(emp => emp.id === leave.employeeId),
      department: departments.find(dept => dept.id === leave.departmentId),
      leaveType: leaveTypes.find(type => type.id === leave.leaveTypeId)
    });
    setIsFormOpen(true);
  };

  // Handle delete
  const handleDelete = (leave: Leave) => {
    setSelectedLeave(leave);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedLeave) {
      deleteLeave(selectedLeave.id);
      toast.success("Xóa đơn nghỉ phép thành công!");
      setIsDeleteDialogOpen(false);
    }
  };

  // Handle department approval
  const handleDepartmentApproval = (leave: Leave) => {
    setSelectedLeave({
      ...leave,
      employee: employees.find(emp => emp.id === leave.employeeId),
      department: departments.find(dept => dept.id === leave.departmentId),
      leaveType: leaveTypes.find(type => type.id === leave.leaveTypeId)
    });
    setApprovalType('department');
    setIsApprovalDialogOpen(true);
  };

  // Handle management approval
  const handleManagementApproval = (leave: Leave) => {
    setSelectedLeave({
      ...leave,
      employee: employees.find(emp => emp.id === leave.employeeId),
      department: departments.find(dept => dept.id === leave.departmentId),
      leaveType: leaveTypes.find(type => type.id === leave.leaveTypeId)
    });
    setApprovalType('management');
    setIsApprovalDialogOpen(true);
  };

  // Approve leave (department or management)
  const approveSelectedLeave = () => {
    if (!selectedLeave) return;
    
    // For now, we'll use a fixed ID for the approver (in a real app, this would be the current user's ID)
    const approverId = "current-user-id";
    
    if (approvalType === 'department') {
      approveDepartment(selectedLeave.id, approverId);
      toast.success("Đã duyệt đơn nghỉ phép (cấp đơn vị)!");
    } else {
      approveLeave(selectedLeave.id, approverId);
      toast.success("Đã duyệt đơn nghỉ phép (cấp quản lý)!");
    }
    
    setIsApprovalDialogOpen(false);
  };

  // Reject leave
  const rejectSelectedLeave = (reason: string) => {
    if (!selectedLeave) return;
    
    // For now, we'll use a fixed ID for the rejector (in a real app, this would be the current user's ID)
    const rejectorId = "current-user-id";
    
    rejectLeave(selectedLeave.id, rejectorId, reason);
    toast.success("Đã từ chối đơn nghỉ phép!");
    
    setIsApprovalDialogOpen(false);
  };

  // Get employee name by ID
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.code} - ${employee.name}` : 'N/A';
  };

  // Get department name by ID
  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'N/A';
  };

  // Get leave type name by ID
  const getLeaveTypeName = (leaveTypeId: string) => {
    const leaveType = leaveTypes.find(type => type.id === leaveTypeId);
    return leaveType ? leaveType.name : 'N/A';
  };

  return (
    <>
      <LeaveFilters 
        filters={filters} 
        onFilterChange={setFilters} 
      />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead>Loại nghỉ phép</TableHead>
              <TableHead>Ngày bắt đầu</TableHead>
              <TableHead>Ngày kết thúc</TableHead>
              <TableHead className="text-center">Số ngày</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  Không có dữ liệu đơn nghỉ phép
                </TableCell>
              </TableRow>
            ) : (
              filteredLeaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>{getEmployeeName(leave.employeeId)}</TableCell>
                  <TableCell>{getDepartmentName(leave.departmentId)}</TableCell>
                  <TableCell>{getLeaveTypeName(leave.leaveTypeId)}</TableCell>
                  <TableCell>{format(new Date(leave.startDate), "dd/MM/yyyy")}</TableCell>
                  <TableCell>{format(new Date(leave.endDate), "dd/MM/yyyy")}</TableCell>
                  <TableCell className="text-center">{leave.numberOfDays}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={leave.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {leave.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDepartmentApproval(leave)}
                          title="Duyệt (Đơn vị)"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      
                      {leave.status === 'department_approved' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleManagementApproval(leave)}
                          title="Duyệt (Quản lý)"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      
                      {(leave.status === 'pending' || leave.status === 'department_approved') && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(leave)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(leave)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Form Dialog */}
      <LeaveForm
        leave={selectedLeave}
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={() => setSelectedLeave(undefined)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Đơn nghỉ phép sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approval Dialog */}
      {selectedLeave && (
        <LeaveApproval
          leave={selectedLeave}
          isOpen={isApprovalDialogOpen}
          type={approvalType}
          onOpenChange={setIsApprovalDialogOpen}
          onApprove={approveSelectedLeave}
          onReject={rejectSelectedLeave}
        />
      )}
    </>
  );
}
