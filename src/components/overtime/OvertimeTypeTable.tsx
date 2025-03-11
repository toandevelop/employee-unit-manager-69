
import { useState } from "react";
import { useAppStore } from "@/store";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
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
import { useToast } from "@/hooks/use-toast";
import { OvertimeType } from "@/types";
import { OvertimeTypeForm } from "./OvertimeTypeForm";

export function OvertimeTypeTable() {
  const { overtimeTypes, deleteOvertimeType, overtimes } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentOvertimeType, setCurrentOvertimeType] = useState<OvertimeType | undefined>(undefined);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEdit = (overtimeType: OvertimeType) => {
    setCurrentOvertimeType(overtimeType);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    // Check if there are any overtimes using this type
    const hasRelatedOvertimes = overtimes.some(overtime => overtime.overtimeTypeId === id);
    
    if (hasRelatedOvertimes) {
      toast({
        title: "Không thể xóa",
        description: "Loại tăng ca này đang được sử dụng bởi các bản ghi tăng ca.",
        variant: "destructive"
      });
      return;
    }
    
    setIdToDelete(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (idToDelete) {
      deleteOvertimeType(idToDelete);
      toast({
        title: "Xóa thành công",
        description: "Đã xóa loại tăng ca"
      });
      setIdToDelete(null);
    }
    setIsAlertOpen(false);
  };

  const handleSuccess = () => {
    setCurrentOvertimeType(undefined);
  };

  return (
    <>
      <Table>
        <TableCaption>Danh sách loại tăng ca</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Mã loại</TableHead>
            <TableHead>Tên loại tăng ca</TableHead>
            <TableHead>Hệ số</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {overtimeTypes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            overtimeTypes.map((type) => (
              <TableRow key={type.id}>
                <TableCell className="font-medium">{type.code}</TableCell>
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.coefficient}x</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(type)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(type.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <OvertimeTypeForm
        overtimeType={currentOvertimeType}
        isOpen={isEditing}
        onOpenChange={setIsEditing}
        onSuccess={handleSuccess}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn loại tăng ca này.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
