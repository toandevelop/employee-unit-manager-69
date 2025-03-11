
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppStore } from "@/store";
import { LeaveType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

// Form schema for validation
const formSchema = z.object({
  code: z.string().min(1, "Mã loại nghỉ phép không được để trống"),
  name: z.string().min(1, "Tên loại nghỉ phép không được để trống"),
});

type FormValues = z.infer<typeof formSchema>;

interface LeaveTypeFormProps {
  leaveType?: LeaveType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function LeaveTypeForm({ leaveType, isOpen, onOpenChange, onSuccess }: LeaveTypeFormProps) {
  const { addLeaveType, updateLeaveType } = useAppStore();
  const isEditing = !!leaveType;

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: leaveType?.code || "",
      name: leaveType?.name || "",
    },
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    try {
      if (isEditing && leaveType) {
        updateLeaveType(leaveType.id, data);
        toast.success("Cập nhật loại nghỉ phép thành công!");
      } else {
        addLeaveType(data);
        toast.success("Thêm loại nghỉ phép thành công!");
      }
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa loại nghỉ phép" : "Thêm loại nghỉ phép mới"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã loại nghỉ phép</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mã loại nghỉ phép" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên loại nghỉ phép</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên loại nghỉ phép" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Hủy
              </Button>
              <Button type="submit">
                {isEditing ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
