
import { useAppStore } from '@/store';
import { EmployeeFormValues } from './types';
import { MultiSelectTag } from '@/components/ui/multi-select-tag';

interface PositionsFieldsetProps {
  formData: EmployeeFormValues;
  setFormData: React.Dispatch<React.SetStateAction<EmployeeFormValues>>;
}

export const PositionsFieldset = ({ formData, setFormData }: PositionsFieldsetProps) => {
  const { positions } = useAppStore();
  
  // Handle position selection change
  const handlePositionChange = (selectedIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      positionIds: selectedIds
    }));
  };

  return (
    <MultiSelectTag
      label="Chức vụ"
      items={positions}
      selectedIds={formData.positionIds}
      onChange={handlePositionChange}
      placeholder="Chọn chức vụ..."
      searchPlaceholder="Tìm kiếm chức vụ..."
    />
  );
};
