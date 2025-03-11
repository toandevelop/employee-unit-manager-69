
import { useMemo } from "react";
import { useAppStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, UserCheck, Users, XCircle } from "lucide-react";

interface LeaveDashboardProps {
  startDate?: Date;
  endDate?: Date;
  departmentId?: string;
  employeeId?: string;
}

export function LeaveDashboard({ startDate, endDate, departmentId, employeeId }: LeaveDashboardProps) {
  const { leaves } = useAppStore();
  
  // Calculate dashboard metrics based on filters
  const metrics = useMemo(() => {
    // Filter leaves based on date range, department, and employee
    const filteredLeaves = leaves.filter(leave => {
      const leaveStartDate = new Date(leave.startDate);
      const leaveEndDate = new Date(leave.endDate);
      
      // Filter by date range
      if (startDate && endDate) {
        // Check if leave period overlaps with filter period
        const isInDateRange = (
          (leaveStartDate >= startDate && leaveStartDate <= endDate) ||
          (leaveEndDate >= startDate && leaveEndDate <= endDate) ||
          (leaveStartDate <= startDate && leaveEndDate >= endDate)
        );
        
        if (!isInDateRange) return false;
      }
      
      // Filter by department
      if (departmentId && leave.departmentId !== departmentId) {
        return false;
      }
      
      // Filter by employee
      if (employeeId && leave.employeeId !== employeeId) {
        return false;
      }
      
      return true;
    });
    
    // Calculate metrics
    const totalEmployees = new Set(filteredLeaves.map(leave => leave.employeeId)).size;
    const totalDays = filteredLeaves.reduce((sum, leave) => sum + leave.numberOfDays, 0);
    const approvedLeaves = filteredLeaves.filter(leave => leave.status === 'approved').length;
    const rejectedLeaves = filteredLeaves.filter(leave => leave.status === 'rejected').length;
    
    return {
      totalEmployees,
      totalDays,
      approvedLeaves,
      rejectedLeaves
    };
  }, [leaves, startDate, endDate, departmentId, employeeId]);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nhân viên nghỉ phép</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalEmployees}</div>
          <p className="text-xs text-muted-foreground">
            Tổng số nhân viên đã đăng ký nghỉ phép
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng số ngày nghỉ</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalDays}</div>
          <p className="text-xs text-muted-foreground">
            Tổng số ngày nghỉ phép đã đăng ký
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.approvedLeaves}</div>
          <p className="text-xs text-muted-foreground">
            Số đơn nghỉ phép đã được duyệt
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Từ chối</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.rejectedLeaves}</div>
          <p className="text-xs text-muted-foreground">
            Số đơn nghỉ phép đã bị từ chối
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
