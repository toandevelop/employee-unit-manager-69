
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

const FormActions = ({ onCancel, isEditing }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
      <Button type="submit">{isEditing ? 'Cập nhật' : 'Tạo mới'}</Button>
    </div>
  );
};

export default FormActions;
