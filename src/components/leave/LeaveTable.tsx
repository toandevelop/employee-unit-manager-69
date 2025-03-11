import { useState, useEffect } from "react";
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
import { Edit, Trash, CheckCircle, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
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

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void 
}) {
  const maxPageDisplay = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageDisplay / 2));
  const endPage = Math.min(totalPages, startPage + maxPageDisplay - 1);
  
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:ml-2">Trước</span>
      </Button>
      
      {startPage > 1 && (
        <>
          <Button
            variant={currentPage === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {startPage > 2 && (
            <Button variant="outline" size="sm" disabled>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
      
      {pages.map(page => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <Button variant="outline" size="sm" disabled>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span className="sr-only sm:not-sr-only sm:mr-2">Sau</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
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
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredLeaves = leaves.filter(leave => {
    const leaveStartDate = new Date(leave.startDate);
    const leaveEndDate = new Date(leave.endDate);
    
    if (filters.startDate && filters.endDate) {
      const isInDateRange = (
        (leaveStartDate >= filters.startDate && leaveStartDate <= filters.endDate) ||
        (leaveEndDate >= filters.startDate && leaveEndDate <= filters.endDate) ||
        (leaveStartDate <= filters.startDate && leaveEndDate >= filters.endDate)
      );
      
      if (!isInDateRange) return false;
    }
    
    if (filters.departmentId && filters.departmentId !== "all-departments" && leave.departmentId !== filters.departmentId) {
      return false;
    }
    
    if (filters.employeeId && filters.employeeId !== "all-employees" && leave.employeeId !== filters.employeeId) {
      return false;
    }
    
    return true;
  });
  
  const totalItems = filteredLeaves.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeaves = filteredLeaves.slice(startIndex, startIndex + itemsPerPage);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleEdit = (leave: Leave) => {
    setSelectedLeave({
      ...leave,
      employee: employees.find(emp => emp.id === leave.employeeId),
      department: departments.find(dept => dept.id === leave.departmentId),
      leaveType: leaveTypes.find(type => type.id === leave.leaveTypeId)
    });
    setIsFormOpen(true);
  };

  const handleDelete = (leave: Leave) => {
    setSelectedLeave(leave);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedLeave) {
      deleteLeave(selectedLeave.id);
      toast.success("Xóa đơn nghỉ phép thành công!");
      setIsDeleteDialogOpen(false);
    }
  };

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

  const approveSelectedLeave = () => {
    if (!selectedLeave) return;
    
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

  const rejectSelectedLeave = (reason: string) => {
    if (!selectedLeave) return;
    
    const rejectorId = "current-user-id";
    
    rejectLeave(selectedLeave.id, rejectorId, reason);
    toast.success("Đã từ chối đơn nghỉ phép!");
    
    setIsApprovalDialogOpen(false);
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.code} - ${employee.name}` : 'N/A';
  };

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'N/A';
  };

  const getLeaveTypeName = (leaveTypeId: string) => {
    const leaveType = leaveTypes.find(type => type.id === leaveTypeId);
    return leaveType ? leaveType.name : 'N/A';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã NV</TableHead>
              <TableHead>Tên nhân viên</TableHead>
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
            {paginatedLeaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-24">
                  Không có dữ liệu đơn nghỉ phép
                </TableCell>
              </TableRow>
            ) : (
              paginatedLeaves.map((leave) => {
                const employee = employees.find(emp => emp.id === leave.employeeId);
                return (
                  <TableRow key={leave.id}>
                    <TableCell>{employee?.code || 'N/A'}</TableCell>
                    <TableCell>{employee?.name || 'N/A'}</TableCell>
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
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      )}

      <LeaveForm
        leave={selectedLeave}
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={() => setSelectedLeave(undefined)}
      />

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
