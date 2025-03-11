
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
import { RawTimeData } from '@/types';
import { useAppStore } from '@/store';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

interface RawDataTableProps {
  rawTimeData: RawTimeData[];
}

const RawDataTable: React.FC<RawDataTableProps> = ({ rawTimeData }) => {
  const { timekeepingDevices } = useAppStore();
  const [page, setPage] = useState(1);
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(rawTimeData.length / itemsPerPage);
  
  const getDeviceName = (deviceId: string) => {
    const device = timekeepingDevices.find(d => d.id === deviceId);
    return device ? device.name : 'N/A';
  };
  
  const paginatedData = rawTimeData
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice((page - 1) * itemsPerPage, page * itemsPerPage);
  
  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableCaption>Dữ liệu chấm công thô</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Mã nhân viên</TableHead>
              <TableHead>Thiết bị</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Hướng</TableHead>
              <TableHead>Đã đồng bộ</TableHead>
              <TableHead>Thời gian đồng bộ</TableHead>
              <TableHead>Đã xử lý</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell className="font-medium">{data.employeeCode}</TableCell>
                  <TableCell>{getDeviceName(data.deviceId)}</TableCell>
                  <TableCell>
                    {format(parseISO(data.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: vi })}
                  </TableCell>
                  <TableCell>
                    {data.direction === 'in' ? 
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Vào</Badge> : 
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Ra</Badge>
                    }
                  </TableCell>
                  <TableCell>
                    {data.synced ? 
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Đã đồng bộ</Badge> : 
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Chưa đồng bộ</Badge>
                    }
                  </TableCell>
                  <TableCell>
                    {data.syncDate ? 
                      format(parseISO(data.syncDate), 'dd/MM/yyyy HH:mm:ss', { locale: vi }) : 
                      '—'
                    }
                  </TableCell>
                  <TableCell>
                    {data.processed ? 
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Đã xử lý</Badge> : 
                      <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Chưa xử lý</Badge>
                    }
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Không có dữ liệu
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
    </>
  );
};

export default RawDataTable;
