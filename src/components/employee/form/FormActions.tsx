
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface FormActionsProps {
  onCancel: () => void;
  onSubmit?: (data?: any) => void;
  isSubmitting?: boolean;
}

export const FormActions = ({ onCancel, onSubmit, isSubmitting }: FormActionsProps) => {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Hủy
      </Button>
      {onSubmit ? (
        <Button type="button" onClick={() => onSubmit()} disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </Button>
      ) : (
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </Button>
      )}
    </DialogFooter>
  );
};
