
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppStore } from "@/store";
import { OvertimeType } from "@/types";
import { useToast } from "@/hooks/use-toast";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  code: z.string().min(2, {
    message: "Mã loại tăng ca phải có ít nhất 2 ký tự",
  }),
  name: z.string().min(3, {
    message: "Tên loại tăng ca phải có ít nhất 3 ký tự",
  }),
  coefficient: z.coerce.number().min(0.1, {
    message: "Hệ số phải lớn hơn 0.1",
  }).max(10, {
    message: "Hệ số không được vượt quá 10",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface OvertimeTypeFormProps {
  overtimeType?: OvertimeType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function OvertimeTypeForm({
  overtimeType,
  isOpen,
  onOpenChange,
  onSuccess,
}: OvertimeTypeFormProps) {
  const { addOvertimeType, updateOvertimeType } = useAppStore();
  const { toast } = useToast();
  const isEditing = !!overtimeType;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: overtimeType?.code || "",
      name: overtimeType?.name || "",
      coefficient: overtimeType?.coefficient || 1,
    },
  });

  function onSubmit(values: FormValues) {
    if (isEditing && overtimeType) {
      updateOvertimeType(overtimeType.id, {
        code: values.code,
        name: values.name,
        coefficient: values.coefficient,
      });
      
      toast({
        title: "Cập nhật thành công",
        description: "Đã cập nhật thông tin loại tăng ca",
      });
    } else {
      addOvertimeType({
        code: values.code,
        name: values.name,
        coefficient: values.coefficient,
      });
      
      toast({
        title: "Thêm mới thành công",
        description: "Đã thêm loại tăng ca mới",
      });
    }
    
    onOpenChange(false);
    onSuccess();
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Cập nhật loại tăng ca" : "Thêm loại tăng ca mới"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã loại tăng ca</FormLabel>
                  <FormControl>
                    <Input placeholder="OT-N" {...field} />
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
                  <FormLabel>Tên loại tăng ca</FormLabel>
                  <FormControl>
                    <Input placeholder="Làm thêm giờ ngày thường" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coefficient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hệ số</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="1"
                      placeholder="1.5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {isEditing ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
