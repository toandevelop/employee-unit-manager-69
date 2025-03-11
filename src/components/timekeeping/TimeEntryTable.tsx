
import { useState } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Pagination, PaginationContent, PaginationItem, 
  PaginationLink, PaginationNext, PaginationPrevious 
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { TimeEntry } from '@/types';
import { useAppStore } from '@/store';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import TimeEntryDialog from './TimeEntryDialog';

interface TimeEntryTableProps {
  entries: TimeEntry[];
}

const TimeEntryTable: React.FC<TimeEntryTableProps> = ({ entries }) => {
  const { employees, departments, workShifts } = useAppStore();
  const [page, setPage] = useState(1);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : 'N/A';
  };
  
  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : 'N/A';
  };
  
  const getWorkShiftName = (workShiftId: string) => {
    const workShift = workShifts.find(w => w.id === workShiftId);
    return workShift ? workShift.name : 'N/A';
  };
  
  const getStatusBadge = (status: TimeEntry['status']) => {
    switch (status) {
      case 'late':
        return <Badge variant="destructive">Đi muộn</Badge>;
      case 'early_leave':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Về sớm</Badge>;
      case 'normal':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Bình thường</Badge>;
      case 'absent':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Vắng mặt</Badge>;
      case 'leave':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Nghỉ phép</Badge>;
      case 'holiday':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Ngày lễ</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };
  
  const paginatedEntries = entries
    .sort((a, b) => new Date(b.workDate).getTime() - new Date(a.workDate).getTime())
    .slice((page - 1) * itemsPerPage, page * itemsPerPage);
  
  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableCaption>Danh sách chấm công</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Mã chấm công</TableHead>
              <TableHead>Ngày làm</TableHead>
              <TableHead>Mã nhân viên</TableHead>
              <TableHead>Tên nhân viên</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead>Ca làm việc</TableHead>
              <TableHead>Giờ vào</TableHead>
              <TableHead>Giờ ra</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[100px]">Giờ tăng ca</TableHead>
              <TableHead className="w-[150px]">Ghi chú</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEntries.length > 0 ? (
              paginatedEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.code}</TableCell>
                  <TableCell>{format(parseISO(entry.workDate), 'dd/MM/yyyy', { locale: vi })}</TableCell>
                  <TableCell>
                    {employees.find(e => e.id === entry.employeeId)?.code || 'N/A'}
                  </TableCell>
                  <TableCell>{getEmployeeName(entry.employeeId)}</TableCell>
                  <TableCell>{getDepartmentName(entry.departmentId)}</TableCell>
                  <TableCell>{getWorkShiftName(entry.workShiftId)}</TableCell>
                  <TableCell>{entry.checkInTime || '—'}</TableCell>
                  <TableCell>{entry.checkOutTime || '—'}</TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  <TableCell>{entry.overtimeHours > 0 ? `${entry.overtimeHours}h` : '—'}</TableCell>
                  <TableCell className="max-w-[150px] truncate" title={entry.notes || ''}>
                    {entry.notes || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingEntry(entry);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Sửa</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center">
                  Không có dữ liệu chấm công nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum = page;
              if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      href="#" 
                      isActive={pageNum === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pageNum);
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
                className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      {/* Edit Dialog */}
      {editingEntry && (
        <TimeEntryDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          entry={editingEntry}
        />
      )}
    </>
  );
};

export default TimeEntryTable;
