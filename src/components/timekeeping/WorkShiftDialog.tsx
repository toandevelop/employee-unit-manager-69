
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppStore } from "@/store";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { WorkShift } from "@/types";

const formSchema = z.object({
  code: z.string().min(2, {
    message: "Mã ca làm việc phải có ít nhất 2 ký tự.",
  }),
  name: z.string().min(3, {
    message: "Tên ca làm việc phải có ít nhất 3 ký tự.",
  }),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Thời gian không hợp lệ. Sử dụng định dạng HH:MM",
  }),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Thời gian không hợp lệ. Sử dụng định dạng HH:MM",
  }),
  description: z.string().optional(),
});

export interface WorkShiftDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workShift?: WorkShift;
}

export function WorkShiftDialog({ isOpen, onOpenChange, workShift }: WorkShiftDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addWorkShift, updateWorkShift } = useAppStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: workShift?.code || "",
      name: workShift?.name || "",
      startTime: workShift?.startTime || "08:00",
      endTime: workShift?.endTime || "17:00",
      description: workShift?.description || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const workShiftData = {
        code: values.code,
        name: values.name,
        startTime: values.startTime,
        endTime: values.endTime,
        description: values.description,
      };
      
      if (workShift) {
        updateWorkShift(workShift.id, workShiftData);
        toast.success("Cập nhật ca làm việc thành công!");
      } else {
        addWorkShift(workShiftData);
        toast.success("Thêm ca làm việc thành công!");
      }
      
      onOpenChange(false);
      form.reset();
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
            {workShift ? "Cập nhật ca làm việc" : "Thêm ca làm việc"}
          </DialogTitle>
          <DialogDescription>
            Vui lòng điền đầy đủ thông tin để {workShift ? "cập nhật" : "thêm"} ca làm việc.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã ca làm việc</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: CA-SANG" {...field} />
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
                  <FormLabel>Tên ca làm việc</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Ca sáng" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian bắt đầu</FormLabel>
                    <FormControl>
                      <Input placeholder="08:00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian kết thúc</FormLabel>
                    <FormControl>
                      <Input placeholder="17:00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả ca làm việc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {workShift ? "Cập nhật" : "Thêm"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
