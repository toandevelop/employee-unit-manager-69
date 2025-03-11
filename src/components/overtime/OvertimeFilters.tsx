
import { useState, useEffect } from "react";
import { useAppStore } from "@/store";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export interface OvertimeFilters {
  filterType: 'month' | 'range';
  startDate: Date;
  endDate: Date;
  departmentId?: string;
  employeeId?: string;
}

interface OvertimeFiltersProps {
  filters: OvertimeFilters;
  onFilterChange: (filters: OvertimeFilters) => void;
}

export function OvertimeFilters({ filters, onFilterChange }: OvertimeFiltersProps) {
  const { employees, departments } = useAppStore();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: filters.startDate,
    to: filters.endDate
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle date selection
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      onFilterChange({
        ...filters,
        startDate: dateRange.from,
        endDate: dateRange.to
      });
    }
  }, [dateRange, onFilterChange]);

  // Handle department selection
  const handleDepartmentChange = (value: string) => {
    if (value === "all") {
      // Clear department filter
      onFilterChange({
        ...filters,
        departmentId: undefined
      });
    } else {
      onFilterChange({
        ...filters,
        departmentId: value
      });
    }
  };

  // Handle employee selection
  const handleEmployeeChange = (value: string) => {
    if (value === "all") {
      // Clear employee filter
      onFilterChange({
        ...filters,
        employeeId: undefined
      });
    } else {
      onFilterChange({
        ...filters,
        employeeId: value
      });
    }
  };

  // Handle filter type change
  const handleFilterTypeChange = (value: 'month' | 'range') => {
    // Update filter type
    onFilterChange({
      ...filters,
      filterType: value
    });
  };

  // Handle month selection
  const handleMonthSelect = (date: Date | undefined) => {
    if (date) {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      setDateRange({
        from: startOfMonth,
        to: endOfMonth
      });
    }
  };

  // Format date for display
  const formatDateRange = () => {
    if (filters.filterType === 'month' && dateRange?.from) {
      return format(dateRange.from, "MMMM yyyy", { locale: vi });
    }
    
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`;
    }
    
    return "Chọn khoảng thời gian";
  };

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <Select
            value={filters.filterType}
            onValueChange={(value) => handleFilterTypeChange(value as 'month' | 'range')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Loại thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Theo tháng</SelectItem>
              <SelectItem value="range">Khoảng thời gian</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {filters.filterType === 'month' ? (
                <Calendar
                  mode="single"
                  selected={dateRange?.from}
                  onSelect={handleMonthSelect}
                  captionLayout="dropdown-buttons"
                  fromYear={2020}
                  toYear={2030}
                  disabled={{ after: new Date() }}
                />
              ) : (
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  disabled={{ after: new Date() }}
                />
              )}
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Select
            value={filters.departmentId || "all"}
            onValueChange={handleDepartmentChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn phòng ban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phòng ban</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select
            value={filters.employeeId || "all"}
            onValueChange={handleEmployeeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn nhân viên" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nhân viên</SelectItem>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading && (
        <div className="flex justify-center mt-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
}
