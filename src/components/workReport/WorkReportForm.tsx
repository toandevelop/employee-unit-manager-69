
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppStore } from "@/store";
import { format } from "date-fns";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Save, Send } from "lucide-react";
import { WorkReport } from "@/store/slices/workReportSlice";
import { Employee } from "@/types";

// Define the form schema
const workReportSchema = z.object({
  employeeId: z.string().min(1, { message: "Vui lòng chọn nhân viên" }),
  weekStartDate: z.string().min(1, { message: "Vui lòng chọn ngày bắt đầu tuần" }),
  weekEndDate: z.string().min(1, { message: "Vui lòng chọn ngày kết thúc tuần" }),
  tasksCompleted: z.string().min(1, { message: "Vui lòng nhập công việc đã hoàn thành" }),
  tasksInProgress: z.string().min(1, { message: "Vui lòng nhập công việc đang thực hiện" }),
  nextWeekPlans: z.string().min(1, { message: "Vui lòng nhập kế hoạch tuần tới" }),
  issues: z.string().optional(),
});

export type WorkReportFormValues = z.infer<typeof workReportSchema>;

interface WorkReportFormProps {
  workReport?: WorkReport;
  employeeId?: string;
  onSubmit: (values: WorkReportFormValues, isDraft: boolean) => void;
  onCancel: () => void;
}

export default function WorkReportForm({
  workReport,
  employeeId,
  onSubmit,
  onCancel,
}: WorkReportFormProps) {
  const { employees } = useAppStore();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Get current week dates if creating a new report
  const getCurrentWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Monday
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // Sunday
    
    return {
      start: format(startDate, 'yyyy-MM-dd'),
      end: format(endDate, 'yyyy-MM-dd')
    };
  };

  const weekDates = getCurrentWeekDates();
  
  // Initialize form with default values or existing report
  const defaultValues: WorkReportFormValues = {
    employeeId: employeeId || workReport?.employeeId || "",
    weekStartDate: workReport?.weekStartDate || weekDates.start,
    weekEndDate: workReport?.weekEndDate || weekDates.end,
    tasksCompleted: workReport?.tasksCompleted || "",
    tasksInProgress: workReport?.tasksInProgress || "",
    nextWeekPlans: workReport?.nextWeekPlans || "",
    issues: workReport?.issues || "",
  };

  const form = useForm<WorkReportFormValues>({
    resolver: zodResolver(workReportSchema),
    defaultValues,
  });

  // Update selected employee when employeeId changes
  useEffect(() => {
    const currentEmployeeId = employeeId || workReport?.employeeId || form.getValues().employeeId;
    if (currentEmployeeId) {
      const employee = employees.find(emp => emp.id === currentEmployeeId);
      if (employee) {
        setSelectedEmployee(employee);
      }
    }
  }, [employeeId, workReport, employees, form]);

  // Handle form submission
  const handleSubmit = (values: WorkReportFormValues, isDraft: boolean) => {
    onSubmit(values, isDraft);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => handleSubmit(values, false))} className="space-y-6">
        <Card className="bg-card border rounded-lg shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Employee selection - show if employeeId is not provided */}
              {!employeeId && (
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhân viên</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            const employee = employees.find(emp => emp.id === e.target.value);
                            setSelectedEmployee(employee || null);
                          }}
                        >
                          <option value="">Chọn nhân viên</option>
                          {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                              {employee.name} ({employee.code})
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Display employee info if selected */}
              {selectedEmployee && (
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <h3 className="font-medium text-muted-foreground">Thông tin nhân viên:</h3>
                  <p><span className="font-medium">Tên:</span> {selectedEmployee.name}</p>
                  <p><span className="font-medium">Mã:</span> {selectedEmployee.code}</p>
                </div>
              )}

              {/* Week dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="weekStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày bắt đầu tuần</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="date"
                            {...field}
                          />
                          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weekEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày kết thúc tuần</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="date"
                            {...field}
                          />
                          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tasks completed */}
              <FormField
                control={form.control}
                name="tasksCompleted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Công việc đã hoàn thành</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Liệt kê các công việc đã hoàn thành trong tuần"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tasks in progress */}
              <FormField
                control={form.control}
                name="tasksInProgress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Công việc đang thực hiện</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Liệt kê các công việc đang thực hiện"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Next week plans */}
              <FormField
                control={form.control}
                name="nextWeekPlans"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kế hoạch tuần tới</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Liệt kê kế hoạch công việc cho tuần tới"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Issues */}
              <FormField
                control={form.control}
                name="issues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vấn đề gặp phải (nếu có)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả các vấn đề, khó khăn gặp phải (nếu có)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              if (form.formState.isValid) {
                handleSubmit(form.getValues(), true);
              } else {
                form.trigger();
              }
            }}
          >
            <Save className="mr-2 h-4 w-4" />
            Lưu nháp
          </Button>
          <Button type="submit">
            <Send className="mr-2 h-4 w-4" />
            Nộp báo cáo
          </Button>
        </div>
      </form>
    </Form>
  );
}
