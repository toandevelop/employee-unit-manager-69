import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';

export interface LeaveFilters {
  filterType: 'week' | 'month' | 'year' | 'custom';
  startDate: Date;
  endDate: Date;
  departmentId?: string;
  employeeId?: string;
}

interface LeaveFiltersProps {
  filters: LeaveFilters;
  onFilterChange: (filters: LeaveFilters) => void;
}

export function LeaveFilters({ filters, onFilterChange }: LeaveFiltersProps) {
  const { departments, employees } = useAppStore();
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  
  const handleFilterTypeChange = (value: 'week' | 'month' | 'year' | 'custom') => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    const currentDayOfWeek = today.getDay() || 7; // Get day of week (0-6), convert Sunday from 0 to 7
    
    let startDate: Date;
    let endDate: Date;
    
    switch (value) {
      case 'week':
        // Start of current week (Monday)
        startDate = new Date(currentYear, currentMonth, currentDay - currentDayOfWeek + 1);
        // End of current week (Sunday)
        endDate = new Date(currentYear, currentMonth, currentDay + (7 - currentDayOfWeek));
        break;
      case 'month':
        // Start of current month
        startDate = new Date(currentYear, currentMonth, 1);
        // End of current month
        endDate = new Date(currentYear, currentMonth + 1, 0);
        break;
      case 'year':
        // Start of current year
        startDate = new Date(currentYear, 0, 1);
        // End of current year
        endDate = new Date(currentYear, 11, 31);
        break;
      case 'custom':
        // Keep current dates for custom
        startDate = filters.startDate;
        endDate = filters.endDate;
        break;
    }
    
    onFilterChange({
      ...filters,
      filterType: value,
      startDate,
      endDate,
    });
  };
  
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      onFilterChange({
        ...filters,
        filterType: 'custom',
        startDate: date,
      });
      setOpenStartDate(false);
    }
  };
  
  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      onFilterChange({
        ...filters,
        filterType: 'custom',
        endDate: date,
      });
      setOpenEndDate(false);
    }
  };
  
  const handleDepartmentChange = (value: string) => {
    onFilterChange({
      ...filters,
      departmentId: value === "all" ? undefined : value,
      employeeId: undefined, // Reset employee when department changes
    });
  };
  
  const handleEmployeeChange = (value: string) => {
    onFilterChange({
      ...filters,
      employeeId: value === "all" ? undefined : value,
    });
  };
  
  // Filter employees based on selected department
  const filteredEmployees = filters.departmentId
    ? employees.filter(emp => 
        emp.departmentEmployees.some(de => de.departmentId === filters.departmentId)
      )
    : employees;
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Select 
              value={filters.filterType} 
              onValueChange={(value) => handleFilterTypeChange(value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
                <SelectItem value="year">Năm này</SelectItem>
                <SelectItem value="custom">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="lg:col-span-1">
            <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate ? format(filters.startDate, "dd/MM/yyyy") : "Từ ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.startDate}
                  onSelect={handleStartDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="lg:col-span-1">
            <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.endDate ? format(filters.endDate, "dd/MM/yyyy") : "Đến ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.endDate}
                  onSelect={handleEndDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="lg:col-span-1">
            <Select 
              value={filters.departmentId || "all"} 
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phòng ban</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="lg:col-span-1">
            <Select 
              value={filters.employeeId || "all"} 
              onValueChange={handleEmployeeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả nhân viên</SelectItem>
                {filteredEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.code} - {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
