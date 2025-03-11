
import { useState, useEffect } from "react";
import { useAppStore } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { Overtime } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OvertimeForm } from "./OvertimeForm";
import { OvertimeTableRow } from "./OvertimeTableRow";
import { OvertimeTablePagination } from "./OvertimeTablePagination";
import { OvertimeDialogs } from "./OvertimeDialogs";

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
                const department = departments.find(d => d.id === overtime.departmentId);
                const overtimeType = overtimeTypes.find(t => t.id === overtime.overtimeTypeId);
                
                return (
                  <OvertimeTableRow
                    key={overtime.id}
                    overtime={overtime}
                    employee={employee}
                    department={department}
                    overtimeType={overtimeType}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDepartmentApprove={handleDepartmentApprove}
                    onApprove={handleApproveDialog}
                    onReject={handleRejectDialog}
                  />
                );
              })
            )}
          </TableBody>
        </Table>
        
        <OvertimeTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Edit Form Dialog */}
      <OvertimeForm
        overtime={currentOvertime}
        isOpen={isEditing}
        onOpenChange={setIsEditing}
        onSuccess={handleSuccess}
      />

      {/* Confirmation Dialogs */}
      <OvertimeDialogs
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isApproveDialogOpen={isApproveDialogOpen}
        setIsApproveDialogOpen={setIsApproveDialogOpen}
        isRejectDialogOpen={isRejectDialogOpen}
        setIsRejectDialogOpen={setIsRejectDialogOpen}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        onConfirmDelete={confirmDelete}
        onConfirmApprove={confirmApprove}
        onConfirmReject={confirmReject}
      />
    </>
  );
}
