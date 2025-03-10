
import { useAppStore } from '@/store';
import { EmployeeFormValues } from './types';
import { MultiSelectTag } from '@/components/ui/multi-select-tag';

interface DepartmentsFieldsetProps {
  formData: EmployeeFormValues;
  setFormData: React.Dispatch<React.SetStateAction<EmployeeFormValues>>;
}

export const DepartmentsFieldset = ({ formData, setFormData }: DepartmentsFieldsetProps) => {
  const { departments } = useAppStore();
  
  // Handle department selection change
  const handleDepartmentChange = (selectedIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      departmentIds: selectedIds
    }));
  };

  return (
    <MultiSelectTag
      label="Đơn vị"
      items={departments}
      selectedIds={formData.departmentIds}
      onChange={handleDepartmentChange}
      placeholder="Chọn đơn vị..."
      searchPlaceholder="Tìm kiếm đơn vị..."
    />
  );
};
