
import { useState } from "react";
import { useAppStore } from "@/store";
import { LeaveType } from "@/types";
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
import { Edit, Trash } from "lucide-react";
import { LeaveTypeForm } from "./LeaveTypeForm";
import { toast } from "sonner";

export function LeaveTypeTable() {
  const { leaveTypes, deleteLeaveType } = useAppStore();
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    setIsFormOpen(true);
  };

  const handleDelete = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedLeaveType) {
      deleteLeaveType(selectedLeaveType.id);
      toast.success("Xóa loại nghỉ phép thành công!");
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Mã loại</TableHead>
              <TableHead>Tên loại nghỉ phép</TableHead>
              <TableHead className="w-[100px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  Chưa có dữ liệu loại nghỉ phép
                </TableCell>
              </TableRow>
            ) : (
              leaveTypes.map((leaveType) => (
                <TableRow key={leaveType.id}>
                  <TableCell className="font-medium">{leaveType.code}</TableCell>
                  <TableCell>{leaveType.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(leaveType)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(leaveType)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <LeaveTypeForm
        leaveType={selectedLeaveType}
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={() => setSelectedLeaveType(undefined)}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Loại nghỉ phép sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
