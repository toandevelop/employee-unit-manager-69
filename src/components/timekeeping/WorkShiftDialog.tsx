
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the form schema
const formSchema = z.object({
  code: z.string().min(1, "Mã ca làm việc không được để trống"),
  name: z.string().min(1, "Tên ca làm việc không được để trống"),
  startTime: z.string().min(1, "Thời gian bắt đầu không được để trống"),
  endTime: z.string().min(1, "Thời gian kết thúc không được để trống"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface WorkShiftDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workShiftId?: string;
  onSuccess?: () => void;
}

export function WorkShiftDialog({
  isOpen,
  onOpenChange,
  workShiftId,
  onSuccess,
}: WorkShiftDialogProps) {
  const { workShifts, addWorkShift, updateWorkShift } = useAppStore();

  // Find the work shift if editing
  const workShift = workShiftId
    ? workShifts.find((ws) => ws.id === workShiftId)
    : undefined;

  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: workShift
      ? {
          code: workShift.code,
          name: workShift.name,
          startTime: workShift.startTime,
          endTime: workShift.endTime,
          description: workShift.description || "",
        }
      : {
          code: "",
          name: "",
          startTime: "08:00",
          endTime: "17:00",
          description: "",
        },
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    if (workShiftId) {
      // Update existing work shift
      updateWorkShift(workShiftId, data);
    } else {
      // Create new work shift with required fields
      addWorkShift({
        code: data.code,
        name: data.name,
        startTime: data.startTime,
        endTime: data.endTime,
        description: data.description || '',
      });
    }

    // Close dialog and trigger success callback
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {workShiftId ? "Cập nhật ca làm việc" : "Thêm ca làm việc mới"}
          </DialogTitle>
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
                    <Input placeholder="VD: CA-SANG" {...field} />
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
                    <Input placeholder="VD: Ca sáng" {...field} />
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
                      <Input type="time" {...field} />
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
                      <Input type="time" {...field} />
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
                  <FormLabel>Mô tả (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả về ca làm việc"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {workShiftId ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
