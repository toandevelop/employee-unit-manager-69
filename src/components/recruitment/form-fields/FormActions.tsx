
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
}

const FormActions = ({ onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
      <Button type="submit">Lưu hồ sơ</Button>
    </div>
  );
};

export default FormActions;
