
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const FormActions = ({ onCancel, isSubmitting }: FormActionsProps) => {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Hủy
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Đang lưu..." : "Lưu"}
      </Button>
    </DialogFooter>
  );
};
