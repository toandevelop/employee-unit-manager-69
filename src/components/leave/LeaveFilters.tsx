
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Filter, X } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false);
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
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium">Bộ lọc</h3>
            {(!isOpen && (tempFilters.departmentId || tempFilters.employeeId || tempFilters.filterType !== 'month')) && (
              <div className="flex flex-wrap gap-1">
                {tempFilters.filterType !== 'month' && (
                  <Badge filterType={tempFilters.filterType} />
                )}
                {tempFilters.departmentId && (
                  <Badge 
                    type="department" 
                    label={departments.find(d => d.id === tempFilters.departmentId)?.name || ''} 
                  />
                )}
                {tempFilters.employeeId && (
                  <Badge 
                    type="employee" 
                    label={employees.find(e => e.id === tempFilters.employeeId)?.name || ''} 
                  />
                )}
              </div>
            )}
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {isOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Khoảng thời gian</label>
              <div className="flex space-x-1">
                <Button 
                  variant={tempFilters.filterType === 'week' ? 'default' : 'outline'} 
                  size="sm" className="flex-1 px-2"
                  onClick={() => setDateRange('week')}
                >
                  Tuần
                </Button>
                <Button 
                  variant={tempFilters.filterType === 'month' ? 'default' : 'outline'} 
                  size="sm" className="flex-1 px-2"
                  onClick={() => setDateRange('month')}
                >
                  Tháng
                </Button>
                <Button 
                  variant={tempFilters.filterType === 'year' ? 'default' : 'outline'} 
                  size="sm" className="flex-1 px-2"
                  onClick={() => setDateRange('year')}
                >
                  Năm
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Từ ngày</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tempFilters.startDate && "text-muted-foreground"
                    )}
                    size="sm"
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
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Đến ngày</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tempFilters.endDate && "text-muted-foreground"
                    )}
                    size="sm"
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
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Đơn vị</label>
              <Select 
                value={tempFilters.departmentId || "all-departments"} 
                onValueChange={(value) => handleDepartmentChange(value === "all-departments" ? "" : value)}
              >
                <SelectTrigger className="h-9">
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
            
            <div className="space-y-1 md:col-span-2 lg:col-span-1">
              <label className="text-sm font-medium">Nhân viên</label>
              <Select 
                value={tempFilters.employeeId || "all-employees"} 
                onValueChange={(value) => 
                  setTempFilters(prev => ({ ...prev, employeeId: value === "all-employees" ? undefined : value }))
                }
                disabled={filteredEmployees.length === 0}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Tất cả nhân viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-employees">Tất cả nhân viên</SelectItem>
                  {(tempFilters.departmentId ? filteredEmployees : employees).map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.code} - {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2 md:col-span-2 lg:col-span-3 items-end">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <X className="h-4 w-4 mr-2" />
                Đặt lại
              </Button>
              <Button size="sm" onClick={applyFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Áp dụng
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// Badge component for displaying active filters
function Badge({ 
  type, 
  label,
  filterType 
}: { 
  type?: 'department' | 'employee'; 
  label?: string;
  filterType?: 'custom' | 'week' | 'month' | 'year' 
}) {
  let content = '';
  
  if (filterType) {
    switch (filterType) {
      case 'week':
        content = 'Tuần này';
        break;
      case 'month':
        content = 'Tháng này';
        break;
      case 'year':
        content = 'Năm này';
        break;
      case 'custom':
        content = 'Tùy chỉnh';
        break;
    }
  } else if (type && label) {
    content = `${type === 'department' ? 'Đơn vị' : 'NV'}: ${label}`;
  }
  
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-primary text-primary-foreground">
      {content}
    </span>
  );
}
