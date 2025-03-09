
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { EmployeeFormValues } from './types';

interface DepartmentsFieldsetProps {
  formData: EmployeeFormValues;
  setFormData: React.Dispatch<React.SetStateAction<EmployeeFormValues>>;
}

export const DepartmentsFieldset = ({ formData, setFormData }: DepartmentsFieldsetProps) => {
  const { departments } = useAppStore();
  const [filteredDepartments, setFilteredDepartments] = useState(departments);
  
  // Update filtered departments when the source data changes
  useEffect(() => {
    setFilteredDepartments(departments);
  }, [departments]);
  
  // Handle department search
  const handleDepartmentSearch = (query: string) => {
    if (!query) {
      setFilteredDepartments(departments);
      return;
    }
    const filtered = departments.filter(dept => 
      dept.name.toLowerCase().includes(query.toLowerCase()) || 
      dept.code.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDepartments(filtered);
  };
  
  // Handle department checkbox change
  const handleDepartmentChange = (departmentId: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return { ...prev, departmentIds: [...prev.departmentIds, departmentId] };
      } else {
        return { ...prev, departmentIds: prev.departmentIds.filter(id => id !== departmentId) };
      }
    });
  };

  return (
    <div className="space-y-2">
      <Label>Đơn vị</Label>
      <div className="grid grid-cols-2 gap-2 p-2 border rounded-md max-h-48 overflow-y-auto">
        <div className="col-span-2 mb-2">
          <Input
            placeholder="Tìm kiếm đơn vị..."
            onChange={(e) => handleDepartmentSearch(e.target.value)}
            className="w-full"
          />
        </div>
        {filteredDepartments.map((department) => (
          <div className="flex items-center space-x-2" key={department.id}>
            <Checkbox
              id={`department-${department.id}`}
              checked={formData.departmentIds.includes(department.id)}
              onCheckedChange={(checked) => 
                handleDepartmentChange(department.id, checked as boolean)
              }
            />
            <Label htmlFor={`department-${department.id}`} className="font-normal">
              {department.name}
            </Label>
          </div>
        ))}
        {filteredDepartments.length === 0 && (
          <div className="col-span-2 text-center text-muted-foreground py-2">
            Không tìm thấy đơn vị phù hợp
          </div>
        )}
      </div>
    </div>
  );
};
