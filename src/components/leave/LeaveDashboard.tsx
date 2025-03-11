
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Leave } from '@/types';

interface LeaveDashboardProps {
  startDate: Date;
  endDate: Date;
  departmentId?: string;
  employeeId?: string;
}

export function LeaveDashboard({
  startDate,
  endDate,
  departmentId,
  employeeId
}: LeaveDashboardProps) {
  const { leaves } = useAppStore();
  const [filteredData, setFilteredData] = useState<Leave[]>([]);
  
  useEffect(() => {
    let filtered = [...leaves];
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.startDate);
        return itemDate >= start && itemDate <= end;
      });
    }
    
    if (departmentId) {
      filtered = filtered.filter(item => item.departmentId === departmentId);
    }
    
    if (employeeId) {
      filtered = filtered.filter(item => item.employeeId === employeeId);
    }
    
    setFilteredData(filtered);
  }, [leaves, startDate, endDate, departmentId, employeeId]);
  
  const totalEntries = filteredData.length;
  const pendingEntries = filteredData.filter(item => item.status === 'pending').length;
  const approvedEntries = filteredData.filter(item => item.status === 'approved').length;
  const rejectedEntries = filteredData.filter(item => item.status === 'rejected').length;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Tổng đăng ký</CardTitle>
          <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEntries}</div>
          <p className="text-xs text-muted-foreground">
            Tổng số đơn nghỉ phép
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingEntries}</div>
          <p className="text-xs text-muted-foreground">
            Đơn nghỉ phép đang chờ duyệt
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approvedEntries}</div>
          <p className="text-xs text-muted-foreground">
            Đơn nghỉ phép đã được duyệt
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Từ chối</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rejectedEntries}</div>
          <p className="text-xs text-muted-foreground">
            Đơn nghỉ phép bị từ chối
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
