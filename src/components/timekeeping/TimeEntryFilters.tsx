
import { Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';

interface TimeEntryFiltersProps {
  dateRange: { from: Date; to: Date };
  setDateRange: (range: { from: Date; to: Date }) => void;
  dateRangeType: 'day' | 'week' | 'month' | 'year' | 'custom';
  setDateRangeType: (type: 'day' | 'week' | 'month' | 'year' | 'custom') => void;
  departmentId: string | null;
  setDepartmentId: (id: string | null) => void;
  employeeId: string | null;
  setEmployeeId: (id: string | null) => void;
}

const TimeEntryFilters: React.FC<TimeEntryFiltersProps> = ({
  dateRange,
  setDateRange,
  dateRangeType,
  setDateRangeType,
  departmentId,
  setDepartmentId,
  employeeId,
  setEmployeeId
}) => {
  const { departments, employees } = useAppStore();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Lọc theo:</span>
          </div>

          {/* Date range type selector */}
          <div className="grid gap-2">
            <Select 
              value={dateRangeType} 
              onValueChange={(value) => setDateRangeType(value as any)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Theo ngày</SelectItem>
                <SelectItem value="week">Theo tuần</SelectItem>
                <SelectItem value="month">Theo tháng</SelectItem>
                <SelectItem value="year">Theo năm</SelectItem>
                <SelectItem value="custom">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date range picker */}
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy", { locale: vi })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: vi })
                    )
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={{
                    from: dateRange?.from,
                    to: dateRange?.to,
                  }}
                  onSelect={(selectedRange) => {
                    if (selectedRange?.from && selectedRange?.to) {
                      setDateRange({ 
                        from: selectedRange.from, 
                        to: selectedRange.to 
                      });
                      setDateRangeType('custom');
                    }
                  }}
                  numberOfMonths={2}
                  locale={vi}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Department filter */}
          <div className="grid gap-2">
            <Select 
              value={departmentId || undefined} 
              onValueChange={(value) => setDepartmentId(value || null)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Chọn đơn vị" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả đơn vị</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employee filter */}
          <div className="grid gap-2">
            <Select 
              value={employeeId || undefined} 
              onValueChange={(value) => setEmployeeId(value || null)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả nhân viên</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeEntryFilters;
