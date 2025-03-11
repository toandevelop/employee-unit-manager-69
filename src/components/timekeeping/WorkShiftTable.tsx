
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { WorkShift } from '@/types';
import { useAppStore } from '@/store';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';

interface WorkShiftTableProps {
  workShifts: WorkShift[];
  onEditClick: (shift: WorkShift) => void;
}

const WorkShiftTable: React.FC<WorkShiftTableProps> = ({ 
  workShifts, 
  onEditClick 
}) => {
  const { deleteWorkShift, timeEntries } = useAppStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleDelete = (id: string) => {
    // Check if there are time entries using this shift
    const hasTimeEntries = timeEntries.some(entry => entry.workShiftId === id);
    
    if (hasTimeEntries) {
      toast.error('Không thể xóa ca làm việc đã có dữ liệu chấm công');
      return;
    }
    
    deleteWorkShift(id);
    toast.success('Xóa ca làm việc thành công');
  };
  
  // Format time string to display in 12-hour format
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minutes} ${period}`;
  };
  
  // Calculate shift duration
  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let durationMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60; // Handle cases where end time is on the next day
    }
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return `${hours} giờ ${minutes > 0 ? `${minutes} phút` : ''}`;
  };
  
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableCaption>Danh sách ca làm việc</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Mã ca</TableHead>
            <TableHead>Tên ca làm việc</TableHead>
            <TableHead>Thời gian bắt đầu</TableHead>
            <TableHead>Thời gian kết thúc</TableHead>
            <TableHead>Thời lượng</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workShifts.length > 0 ? (
            workShifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell className="font-medium">{shift.code}</TableCell>
                <TableCell>{shift.name}</TableCell>
                <TableCell>{shift.startTime}</TableCell>
                <TableCell>{shift.endTime}</TableCell>
                <TableCell>{calculateDuration(shift.startTime, shift.endTime)}</TableCell>
                <TableCell>{shift.description || '—'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditClick(shift)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Sửa</span>
                    </Button>
                    
                    <AlertDialog open={deletingId === shift.id} onOpenChange={(open) => !open && setDeletingId(null)}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingId(shift.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Xóa</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa ca làm việc này? Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(shift.id)}
                          >
                            Xác nhận
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Không có ca làm việc nào
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkShiftTable;
