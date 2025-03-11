
import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store';

export interface OvertimeFilters {
  filterType: 'day' | 'week' | 'month' | 'year' | 'custom';
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
  const { departments, employees } = useAppStore();
  const [localFilters, setLocalFilters] = useState<OvertimeFilters>(filters);
  
  // Handler for filter type changes
  const handleFilterTypeChange = (type: OvertimeFilters['filterType']) => {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    switch (type) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'week':
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        startDate = new Date(now.setDate(diff));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      default:
        // Keep current dates for custom
        startDate = localFilters.startDate;
        endDate = localFilters.endDate;
    }
    
    const newFilters: OvertimeFilters = {
      ...localFilters,
      filterType: type,
      startDate,
      endDate
    };
    
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Handler for date changes
  const handleDateChange = (field: 'startDate' | 'endDate', date: Date) => {
    if (!date) return;
    
    // If start date is after end date, adjust end date
    if (field === 'startDate' && date > localFilters.endDate) {
      const newFilters: OvertimeFilters = {
        ...localFilters,
        filterType: 'custom',
        startDate: date,
        endDate: date
      };
      setLocalFilters(newFilters);
      onFilterChange(newFilters);
      return;
    }
    
    // If end date is before start date, adjust start date
    if (field === 'endDate' && date < localFilters.startDate) {
      const newFilters: OvertimeFilters = {
        ...localFilters,
        filterType: 'custom',
        startDate: date,
        endDate: date
      };
      setLocalFilters(newFilters);
      onFilterChange(newFilters);
      return;
    }
    
    const newFilters: OvertimeFilters = {
      ...localFilters,
      filterType: 'custom',
      [field]: date
    };
    
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Handler for department or employee changes
  const handleSelectChange = (field: 'departmentId' | 'employeeId', value: string) => {
    const newFilters: OvertimeFilters = {
      ...localFilters,
      [field]: value || undefined
    };
    
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  useEffect(() => {
    // Update local filters when props change
    setLocalFilters(filters);
  }, [filters]);
  
  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-3">
          <label className="text-sm font-medium mb-1 block">Khoảng thời gian</label>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant={localFilters.filterType === 'day' ? 'default' : 'outline'} 
              onClick={() => handleFilterTypeChange('day')}
            >
              Ngày
            </Button>
            <Button 
              size="sm" 
              variant={localFilters.filterType === 'week' ? 'default' : 'outline'} 
              onClick={() => handleFilterTypeChange('week')}
            >
              Tuần
            </Button>
            <Button 
              size="sm" 
              variant={localFilters.filterType === 'month' ? 'default' : 'outline'} 
              onClick={() => handleFilterTypeChange('month')}
            >
              Tháng
            </Button>
            <Button 
              size="sm" 
              variant={localFilters.filterType === 'year' ? 'default' : 'outline'} 
              onClick={() => handleFilterTypeChange('year')}
            >
              Năm
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-4 flex gap-2">
          <div className="w-1/2">
            <label className="text-sm font-medium mb-1 block">Từ ngày</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {localFilters.startDate ? (
                    format(localFilters.startDate, 'dd/MM/yyyy')
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={localFilters.startDate}
                  onSelect={(date) => date && handleDateChange('startDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="w-1/2">
            <label className="text-sm font-medium mb-1 block">Đến ngày</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {localFilters.endDate ? (
                    format(localFilters.endDate, 'dd/MM/yyyy')
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={localFilters.endDate}
                  onSelect={(date) => date && handleDateChange('endDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1 block">Phòng ban</label>
          <Select
            value={localFilters.departmentId || ""}
            onValueChange={(value) => handleSelectChange('departmentId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả phòng ban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả phòng ban</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-3">
          <label className="text-sm font-medium mb-1 block">Nhân viên</label>
          <Select
            value={localFilters.employeeId || ""}
            onValueChange={(value) => handleSelectChange('employeeId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả nhân viên" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả nhân viên</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.code} - {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
