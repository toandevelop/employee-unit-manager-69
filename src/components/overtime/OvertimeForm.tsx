
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from 'date-fns';
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
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store";
import { Overtime } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";

const formSchema = z.object({
  employeeId: z.string({
    required_error: "Vui lòng chọn nhân viên",
  }),
  departmentId: z.string({
    required_error: "Vui lòng chọn phòng ban",
  }),
  overtimeTypeId: z.string({
    required_error: "Vui lòng chọn loại tăng ca",
  }),
  overtimeDate: z.date({
    required_error: "Vui lòng chọn ngày tăng ca",
  }),
  startTime: z.string().min(5, {
    message: "Vui lòng nhập thời gian bắt đầu",
  }),
  endTime: z.string().min(5, {
    message: "Vui lòng nhập thời gian kết thúc",
  }),
  content: z.string().min(5, {
    message: "Nội dung phải có ít nhất 5 ký tự",
  }),
}).refine(data => {
  const start = data.startTime.split(':').map(Number);
  const end = data.endTime.split(':').map(Number);
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];
  return endMinutes > startMinutes;
}, {
  message: "Thời gian kết thúc phải sau thời gian bắt đầu",
  path: ["endTime"],
});

type FormValues = z.infer<typeof formSchema>;

interface OvertimeFormProps {
  overtime?: Overtime;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function OvertimeForm({
  overtime,
  isOpen,
  onOpenChange,
  onSuccess,
}: OvertimeFormProps) {
  const { employees, departments, overtimeTypes, addOvertime, updateOvertime } = useAppStore();
  const { toast } = useToast();
  const isEditing = !!overtime;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: overtime?.employeeId || "",
      departmentId: overtime?.departmentId || "",
      overtimeTypeId: overtime?.overtimeTypeId || "",
      overtimeDate: overtime ? new Date(overtime.overtimeDate) : new Date(),
      startTime: overtime?.startTime || "",
      endTime: overtime?.endTime || "",
      content: overtime?.content || "",
    },
  });

  function onSubmit(values: FormValues) {
    const overtimeData = {
      employeeId: values.employeeId,
      departmentId: values.departmentId,
      overtimeTypeId: values.overtimeTypeId,
      overtimeDate: format(values.overtimeDate, 'yyyy-MM-dd'),
      startTime: values.startTime,
      endTime: values.endTime,
      content: values.content
    };

    if (isEditing && overtime) {
      updateOvertime(overtime.id, overtimeData);
      toast({
        title: "Cập nhật thành công",
        description: `Đã cập nhật thông tin tăng ca`,
      });
    } else {
      addOvertime(overtimeData);
      toast({
        title: "Thêm mới thành công",
        description: `Đã thêm đơn tăng ca mới`,
      });
    }
    onOpenChange(false);
    onSuccess();
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Cập nhật thông tin tăng ca" : "Đăng ký tăng ca mới"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhân viên</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhân viên" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.code} - {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phòng ban</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phòng ban" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="overtimeTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại tăng ca</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại tăng ca" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {overtimeTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} ({type.coefficient}x)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="overtimeDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày tăng ca</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung công việc</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Mô tả công việc tăng ca..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">
                {isEditing ? "Cập nhật" : "Đăng ký"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
