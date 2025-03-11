
import { useState, useEffect } from "react";
import { useAppStore } from "@/store";
import { format, parseISO } from "date-fns";
import { 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  XCircle
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { OvertimeForm } from "./OvertimeForm";
import { Overtime } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface OvertimeTableProps {
  startDate: Date;
  endDate: Date;
  departmentId?: string;
  employeeId?: string;
}

export function OvertimeTable({
  startDate,
  endDate,
  departmentId,
  employeeId,
}: OvertimeTableProps) {
  const { 
    overtimes, 
    employees, 
    departments, 
    overtimeTypes,
    deleteOvertime, 
    departmentApproveOvertime,
    approveOvertime,
    rejectOvertime
  } = useAppStore();
  const [filteredOvertimes, setFilteredOvertimes] = useState<Overtime[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOvertime, setCurrentOvertime] = useState<Overtime | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // Update filtered data when props change
  useEffect(() => {
    let filtered = [...overtimes];
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.overtimeDate);
        return itemDate >= start && itemDate <= end;
      });
    }
    
    if (departmentId) {
      filtered = filtered.filter(item => item.departmentId === departmentId);
    }
    
    if (employeeId) {
      filtered = filtered.filter(item => item.employeeId === employeeId);
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.overtimeDate).getTime() - new Date(a.overtimeDate).getTime());
    
    setFilteredOvertimes(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize));
    setCurrentPage(1); // Reset to first page when filters change
  }, [overtimes, startDate, endDate, departmentId, employeeId, pageSize]);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredOvertimes.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? `${employee.code} - ${employee.name}` : "Unknown";
  };

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : "Unknown";
  };

  const getOvertimeTypeName = (typeId: string) => {
    const type = overtimeTypes.find(t => t.id === typeId);
    return type ? type.name : "Unknown";
  };

  const getStatusBadge = (status: Overtime['status']) => {
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
  };

  const handleEdit = (overtime: Overtime) => {
    setCurrentOvertime(overtime);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (idToDelete) {
      deleteOvertime(idToDelete);
      toast({
        title: "Xóa thành công",
        description: "Đã xóa đơn tăng ca"
      });
    }
    setIsDeleteDialogOpen(false);
  };

  const handleDepartmentApprove = (id: string) => {
    // Assume current user has ID "emp-1" for demo purposes
    // In a real app, you'd get this from authentication
    departmentApproveOvertime(id, "emp-1");
    toast({
      title: "Phê duyệt thành công",
      description: "Đã phê duyệt đơn tăng ca"
    });
  };

  const handleApproveDialog = (id: string) => {
    setCurrentId(id);
    setIsApproveDialogOpen(true);
  };

  const confirmApprove = () => {
    if (currentId) {
      // Assume current user has ID "emp-1" for demo purposes
      approveOvertime(currentId, "emp-1");
      toast({
        title: "Phê duyệt thành công",
        description: "Đã phê duyệt đơn tăng ca"
      });
    }
    setIsApproveDialogOpen(false);
  };

  const handleRejectDialog = (id: string) => {
    setCurrentId(id);
    setRejectionReason("");
    setIsRejectDialogOpen(true);
  };

  const confirmReject = () => {
    if (currentId && rejectionReason.trim()) {
      // Assume current user has ID "emp-1" for demo purposes
      rejectOvertime(currentId, "emp-1", rejectionReason);
      toast({
        title: "Từ chối thành công",
        description: "Đã từ chối đơn tăng ca"
      });
    }
    setIsRejectDialogOpen(false);
  };

  const handleSuccess = () => {
    setCurrentOvertime(undefined);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 3;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {startPage > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
            </PaginationItem>
          )}
          
          {startPage > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          
          {pageNumbers.map(page => (
            <PaginationItem key={page}>
              <PaginationLink 
                isActive={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          {endPage < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          
          {endPage < totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã NV</TableHead>
              <TableHead>Tên NV</TableHead>
              <TableHead>Phòng ban</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead>Bắt đầu</TableHead>
              <TableHead>Kết thúc</TableHead>
              <TableHead>Số giờ</TableHead>
              <TableHead>Loại tăng ca</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentPageItems().length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center h-32">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              getCurrentPageItems().map((overtime) => {
                const employee = employees.find(e => e.id === overtime.employeeId);
                return (
                  <TableRow key={overtime.id}>
                    <TableCell>{employee?.code || "N/A"}</TableCell>
                    <TableCell>{employee?.name || "N/A"}</TableCell>
                    <TableCell>{getDepartmentName(overtime.departmentId)}</TableCell>
                    <TableCell>{format(parseISO(overtime.overtimeDate), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{overtime.startTime}</TableCell>
                    <TableCell>{overtime.endTime}</TableCell>
                    <TableCell>{overtime.hours}</TableCell>
                    <TableCell>{getOvertimeTypeName(overtime.overtimeTypeId)}</TableCell>
                    <TableCell>{getStatusBadge(overtime.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {overtime.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDepartmentApprove(overtime.id)}
                              title="Duyệt đơn vị"
                            >
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(overtime)}
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(overtime.id)}
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
                              onClick={() => handleApproveDialog(overtime.id)}
                              title="Phê duyệt"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRejectDialog(overtime.id)}
                              title="Từ chối"
                            >
                              <XCircle className="h-4 w-4" />
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
        
        {renderPagination()}
      </div>

      {/* Edit Form Dialog */}
      <OvertimeForm
        overtime={currentOvertime}
        isOpen={isEditing}
        onOpenChange={setIsEditing}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đơn tăng ca này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận phê duyệt</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn phê duyệt đơn tăng ca này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove}>Phê duyệt</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối đơn tăng ca</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối đơn tăng ca này.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Lý do từ chối..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmReject} disabled={!rejectionReason.trim()}>
              Từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
