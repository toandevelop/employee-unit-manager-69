
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { LeaveType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  code: z.string().min(2, {
    message: "Mã loại nghỉ phép phải có ít nhất 2 ký tự.",
  }),
  name: z.string().min(3, {
    message: "Tên loại nghỉ phép phải có ít nhất 3 ký tự.",
  }),
  description: z.string().optional(),
  daysAllowed: z.coerce.number().min(0, {
    message: "Số ngày phải là số không âm",
  }),
  paidPercentage: z.coerce.number().min(0).max(100, {
    message: "Phần trăm lương phải từ 0 đến 100",
  }),
});

interface LeaveTypeFormProps {
  leaveType?: LeaveType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function LeaveTypeForm({ isOpen, onOpenChange, leaveType, onSuccess }: LeaveTypeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addLeaveType, updateLeaveType } = useAppStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: leaveType?.code || "",
      name: leaveType?.name || "",
      description: leaveType?.description || "",
      daysAllowed: leaveType?.daysAllowed || 0,
      paidPercentage: leaveType?.paidPercentage || 100,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Make sure we're passing required fields, not optional ones
      const leaveTypeData = {
        code: values.code,
        name: values.name,
        description: values.description,
        daysAllowed: values.daysAllowed,
        paidPercentage: values.paidPercentage,
      };
      
      if (leaveType) {
        updateLeaveType(leaveType.id, leaveTypeData);
        toast.success("Cập nhật loại nghỉ phép thành công!");
      } else {
        addLeaveType(leaveTypeData);
        toast.success("Thêm loại nghỉ phép thành công!");
      }
      
      onOpenChange(false);
      form.reset();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {leaveType ? "Cập nhật loại nghỉ phép" : "Thêm loại nghỉ phép"}
          </DialogTitle>
          <DialogDescription>
            Vui lòng điền đầy đủ thông tin để {leaveType ? "cập nhật" : "thêm"} loại nghỉ phép.
          </DialogDescription>
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
                    <Input placeholder="Ví dụ: NP-01" {...field} />
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
                    <Input placeholder="Ví dụ: Nghỉ phép có lương" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả về loại nghỉ phép" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="daysAllowed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số ngày cho phép</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="Số ngày" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paidPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phần trăm lương (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="100" placeholder="Phần trăm lương" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {leaveType ? "Cập nhật" : "Thêm"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
