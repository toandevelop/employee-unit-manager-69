
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useAppStore } from "@/store";
import { Leave, Employee } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Form schema for validation
const formSchema = z.object({
  employeeId: z.string().min(1, "Vui lòng chọn nhân viên"),
  leaveTypeId: z.string().min(1, "Vui lòng chọn loại nghỉ phép"),
  departmentId: z.string().min(1, "Vui lòng chọn đơn vị"),
  startDate: z.date({
    required_error: "Vui lòng chọn ngày bắt đầu",
  }),
  endDate: z.date({
    required_error: "Vui lòng chọn ngày kết thúc",
  }),
}).refine((data) => data.endDate >= data.startDate, {
  message: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
  path: ["endDate"],
});

type FormValues = z.infer<typeof formSchema>;

interface LeaveFormProps {
  leave?: Leave;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function LeaveForm({ leave, isOpen, onOpenChange, onSuccess }: LeaveFormProps) {
  const { 
    employees, 
    departments, 
    leaveTypes, 
    departmentEmployees,
    addLeave, 
    updateLeave 
  } = useAppStore();
  
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  
  const isEditing = !!leave;

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: leave?.employeeId || "",
      leaveTypeId: leave?.leaveTypeId || "",
      departmentId: leave?.departmentId || "",
      startDate: leave?.startDate ? new Date(leave.startDate) : undefined as any,
      endDate: leave?.endDate ? new Date(leave.endDate) : undefined as any,
    },
  });

  // Filter employees based on selected department
  useEffect(() => {
    const departmentId = form.getValues("departmentId");
    if (departmentId) {
      setSelectedDepartment(departmentId);
      
      const departmentEmployeeIds = departmentEmployees
        .filter(de => de.departmentId === departmentId)
        .map(de => de.employeeId);
      
      const filteredEmps = employees.filter(emp => 
        departmentEmployeeIds.includes(emp.id)
      );
      
      setFilteredEmployees(filteredEmps);
    } else {
      setFilteredEmployees([]);
    }
  }, [form.watch("departmentId"), departmentEmployees, employees]);

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    try {
      const leaveData = {
        employeeId: data.employeeId,
        leaveTypeId: data.leaveTypeId,
        departmentId: data.departmentId,
        startDate: format(data.startDate, "yyyy-MM-dd"),
        endDate: format(data.endDate, "yyyy-MM-dd"),
      };

      if (isEditing && leave) {
        updateLeave(leave.id, leaveData);
        toast.success("Cập nhật đơn nghỉ phép thành công!");
      } else {
        addLeave(leaveData);
        toast.success("Thêm đơn nghỉ phép thành công!");
      }
      
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
      console.error(error);
    }
  };

  // Handle department change
  const handleDepartmentChange = (departmentId: string) => {
    form.setValue("departmentId", departmentId);
    form.setValue("employeeId", ""); // Reset employee selection when department changes
    
    if (departmentId) {
      const departmentEmployeeIds = departmentEmployees
        .filter(de => de.departmentId === departmentId)
        .map(de => de.employeeId);
      
      const filteredEmps = employees.filter(emp => 
        departmentEmployeeIds.includes(emp.id)
      );
      
      setFilteredEmployees(filteredEmps);
    } else {
      setFilteredEmployees([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa đơn nghỉ phép" : "Thêm đơn nghỉ phép mới"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đơn vị</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleDepartmentChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đơn vị" />
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

            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhân viên</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!form.getValues("departmentId")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhân viên" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.code} - {employee.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key="no-employees" value="no-employees" disabled>
                          {form.getValues("departmentId") 
                            ? "Không có nhân viên trong đơn vị này" 
                            : "Vui lòng chọn đơn vị trước"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leaveTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại nghỉ phép</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại nghỉ phép" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {leaveTypes.map((leaveType) => (
                        <SelectItem key={leaveType.id} value={leaveType.id}>
                          {leaveType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày kết thúc</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
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
                          initialFocus
                          disabled={(date) => date < form.getValues("startDate")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
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
