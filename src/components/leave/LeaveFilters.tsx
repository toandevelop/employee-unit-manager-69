import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface LeaveFilters {
  startDate?: Date;
  endDate?: Date;
  departmentId?: string;
  employeeId?: string;
  filterType: 'custom' | 'week' | 'month' | 'year';
}

interface LeaveFiltersProps {
  filters: LeaveFilters;
  onFilterChange: (filters: LeaveFilters) => void;
}

export function LeaveFilters({ filters, onFilterChange }: LeaveFiltersProps) {
  const { departments, employees, departmentEmployees } = useAppStore();
  const [tempFilters, setTempFilters] = useState<LeaveFilters>(filters);
  const [filteredEmployees, setFilteredEmployees] = useState<typeof employees>([]);

  useEffect(() => {
    setTempFilters(filters);
    
    if (filters.departmentId) {
      const departmentEmployeeIds = departmentEmployees
        .filter(de => de.departmentId === filters.departmentId)
        .map(de => de.employeeId);
      
      const filtered = employees.filter(emp => 
        departmentEmployeeIds.includes(emp.id)
      );
      
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [filters, departments, employees, departmentEmployees]);

  const setDateRange = (filterType: 'custom' | 'week' | 'month' | 'year') => {
    const now = new Date();
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (filterType === 'week') {
      const day = now.getDay() || 7;
      startDate = new Date(now);
      startDate.setDate(now.getDate() - day + 1);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (filterType === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (filterType === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
    } else {
      startDate = tempFilters.startDate || now;
      endDate = tempFilters.endDate || now;
    }

    setTempFilters(prev => ({
      ...prev,
      filterType,
      startDate,
      endDate
    }));
  };

  const handleDepartmentChange = (departmentId: string) => {
    if (departmentId) {
      const departmentEmployeeIds = departmentEmployees
        .filter(de => de.departmentId === departmentId)
        .map(de => de.employeeId);
      
      const filtered = employees.filter(emp => 
        departmentEmployeeIds.includes(emp.id)
      );
      
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }

    setTempFilters(prev => ({
      ...prev,
      departmentId,
      employeeId: undefined
    }));
  };

  const applyFilters = () => {
    onFilterChange(tempFilters);
  };

  const resetFilters = () => {
    const resetFilters: LeaveFilters = {
      filterType: 'month',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      departmentId: undefined,
      employeeId: undefined
    };
    setTempFilters(resetFilters);
    setFilteredEmployees(employees);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-card rounded-md border p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">Bộ lọc</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Thời gian</label>
          <div className="flex space-x-2">
            <Button 
              variant={tempFilters.filterType === 'week' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setDateRange('week')}
            >
              Tuần
            </Button>
            <Button 
              variant={tempFilters.filterType === 'month' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setDateRange('month')}
            >
              Tháng
            </Button>
            <Button 
              variant={tempFilters.filterType === 'year' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setDateRange('year')}
            >
              Năm
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Từ ngày</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !tempFilters.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {tempFilters.startDate ? (
                  format(tempFilters.startDate, "dd/MM/yyyy")
                ) : (
                  <span>Chọn ngày</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={tempFilters.startDate}
                onSelect={(date) => 
                  setTempFilters(prev => ({ ...prev, startDate: date, filterType: 'custom' }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Đến ngày</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !tempFilters.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {tempFilters.endDate ? (
                  format(tempFilters.endDate, "dd/MM/yyyy")
                ) : (
                  <span>Chọn ngày</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={tempFilters.endDate}
                onSelect={(date) => 
                  setTempFilters(prev => ({ ...prev, endDate: date, filterType: 'custom' }))
                }
                initialFocus
                disabled={(date) => date < (tempFilters.startDate || new Date())}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Đơn vị</label>
          <Select 
            value={tempFilters.departmentId} 
            onValueChange={handleDepartmentChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả đơn vị" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-departments">Tất cả đơn vị</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Nhân viên</label>
          <Select 
            value={tempFilters.employeeId} 
            onValueChange={(value) => 
              setTempFilters(prev => ({ ...prev, employeeId: value === "all-employees" ? undefined : value }))
            }
            disabled={!tempFilters.departmentId && filteredEmployees.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả nhân viên" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-employees">Tất cả nhân viên</SelectItem>
              {(tempFilters.departmentId && tempFilters.departmentId !== "all-departments" ? filteredEmployees : employees).map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.code} - {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={resetFilters}>
          Đặt lại
        </Button>
        <Button onClick={applyFilters}>
          Áp dụng
        </Button>
      </div>
    </div>
  );
}
