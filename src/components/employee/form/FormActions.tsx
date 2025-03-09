
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface FormActionsProps {
  onCancel: () => void;
}

export const FormActions = ({ onCancel }: FormActionsProps) => {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel}>
        Hủy
      </Button>
      <Button type="submit">Lưu</Button>
    </DialogFooter>
  );
};
