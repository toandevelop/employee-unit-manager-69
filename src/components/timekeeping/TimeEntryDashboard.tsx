
import { useState } from 'react';
import { useAppStore } from '@/store';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import TimeEntryFilters from './TimeEntryFilters';
import TimeEntryTable from './TimeEntryTable';

const TimeEntryDashboard = () => {
  const { timeEntries, employees, departments } = useAppStore();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfWeek(new Date(), { locale: vi }),
    to: endOfWeek(new Date(), { locale: vi })
  });
  const [dateRangeType, setDateRangeType] = useState<'day' | 'week' | 'month' | 'year' | 'custom'>('week');
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  // Update date range based on range type
  const updateDateRange = (type: 'day' | 'week' | 'month' | 'year' | 'custom') => {
    const today = new Date();
    let from: Date;
    let to: Date;

    switch (type) {
      case 'day':
        from = startOfDay(today);
        to = endOfDay(today);
        break;
      case 'week':
        from = startOfWeek(today, { locale: vi });
        to = endOfWeek(today, { locale: vi });
        break;
      case 'month':
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      case 'year':
        from = startOfYear(today);
        to = endOfYear(today);
        break;
      default:
        return; // No change for custom
    }

    setDateRangeType(type);
    setDateRange({ from, to });
  };

  // Filter time entries based on criteria
  const filteredEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.workDate);
    const isInDateRange = entryDate >= dateRange.from && entryDate <= dateRange.to;
    const isInDepartment = departmentId === null || departmentId === 'all' ? true : entry.departmentId === departmentId;
    const isForEmployee = employeeId === null || employeeId === 'all' ? true : entry.employeeId === employeeId;
    return isInDateRange && isInDepartment && isForEmployee;
  });

  // Calculate statistics
  const totalCheckedIn = filteredEntries.filter(entry => 
    entry.checkInTime && (entry.status !== 'absent' && entry.status !== 'leave')
  ).length;
  
  const totalLate = filteredEntries.filter(entry => entry.status === 'late').length;
  const totalEarlyLeave = filteredEntries.filter(entry => entry.status === 'early_leave').length;
  const totalNormal = filteredEntries.filter(entry => entry.status === 'normal').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Điểm danh</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCheckedIn}</div>
            <p className="text-xs text-muted-foreground">
              Số nhân viên điểm danh hôm nay
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đi muộn</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLate}</div>
            <p className="text-xs text-muted-foreground">
              Số nhân viên đi muộn
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Về sớm</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarlyLeave}</div>
            <p className="text-xs text-muted-foreground">
              Số nhân viên về sớm
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bình thường</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNormal}</div>
            <p className="text-xs text-muted-foreground">
              Số nhân viên điểm danh đúng giờ
            </p>
          </CardContent>
        </Card>
      </div>

      <TimeEntryFilters 
        dateRange={dateRange}
        setDateRange={setDateRange}
        dateRangeType={dateRangeType}
        setDateRangeType={updateDateRange}
        departmentId={departmentId}
        setDepartmentId={setDepartmentId}
        employeeId={employeeId}
        setEmployeeId={setEmployeeId}
      />

      <TimeEntryTable entries={filteredEntries} />
    </div>
  );
};

export default TimeEntryDashboard;
