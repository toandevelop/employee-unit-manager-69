
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Employee, Department, Position, AcademicDegree, AcademicTitle } from "@/types";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { vi } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

const formSchema = z.object({
  code: z.string().min(1, "Mã nhân viên không được để trống"),
  name: z.string().min(1, "Tên nhân viên không được để trống"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  phone: z.string().min(1, "Số điện thoại không được để trống"),
  identityCard: z.string().min(1, "Số CMND/CCCD không được để trống"),
  contractDate: z.string().min(1, "Ngày hợp đồng không được để trống"),
  departmentIds: z.array(z.string()).min(1, "Phải chọn ít nhất một đơn vị"),
  positionIds: z.array(z.string()).min(1, "Phải chọn ít nhất một chức vụ"),
  academicDegreeId: z.string().min(1, "Học vị không được để trống"),
  academicTitleId: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof formSchema>;

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (values: EmployeeFormValues) => void;
  onCancel: () => void;
}

export default function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const { departments, positions, departmentEmployees, positionEmployees, academicDegrees, academicTitles } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    employee?.contractDate
      ? new Date(employee.contractDate)
      : undefined
  );

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: employee?.code || "",
      name: employee?.name || "",
      address: employee?.address || "",
      phone: employee?.phone || "",
      identityCard: employee?.identityCard || "",
      contractDate: employee?.contractDate || "",
      departmentIds: employee
        ? departmentEmployees
            .filter((de) => de.employeeId === employee.id)
            .map((de) => de.departmentId)
        : [],
      positionIds: employee
        ? positionEmployees
            .filter((pe) => pe.employeeId === employee.id)
            .map((pe) => pe.positionId)
        : [],
      academicDegreeId: employee?.academicDegreeId || "",
      academicTitleId: employee?.academicTitleId || "",
    },
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      form.setValue("contractDate", format(date, "yyyy-MM-dd"));
    }
  };

  useEffect(() => {
    if (employee) {
      // Populate department IDs
      const departmentIds = departmentEmployees
        .filter((de) => de.employeeId === employee.id)
        .map((de) => de.departmentId);
      form.setValue("departmentIds", departmentIds);

      // Populate position IDs
      const positionIds = positionEmployees
        .filter((pe) => pe.employeeId === employee.id)
        .map((pe) => pe.positionId);
      form.setValue("positionIds", positionIds);
      
      // Populate academic degree and title
      if (employee.academicDegreeId) {
        form.setValue("academicDegreeId", employee.academicDegreeId);
      }
      if (employee.academicTitleId) {
        form.setValue("academicTitleId", employee.academicTitleId);
      }
    }
  }, [employee, departmentEmployees, positionEmployees, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã nhân viên</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập mã nhân viên..." {...field} />
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
                <FormLabel>Tên nhân viên</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên nhân viên..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập địa chỉ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="identityCard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số CMND/CCCD</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số CMND/CCCD..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contractDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày hợp đồng</FormLabel>
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
                          format(new Date(field.value), "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày hợp đồng</span>
                        )}
                        <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      locale={vi}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="academicDegreeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Học vị</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn học vị" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {academicDegrees.map((degree) => (
                      <SelectItem key={degree.id} value={degree.id}>
                        {degree.name} ({degree.shortName})
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
            name="academicTitleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Học hàm</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn học hàm (không bắt buộc)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Không có</SelectItem>
                    {academicTitles.map((title) => (
                      <SelectItem key={title.id} value={title.id}>
                        {title.name} ({title.shortName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="departments">
            <AccordionTrigger>Đơn vị công tác</AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="departmentIds"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Chọn đơn vị công tác
                      </FormLabel>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {departments.map((department) => (
                        <FormField
                          key={department.id}
                          control={form.control}
                          name="departmentIds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={department.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 mt-1 text-primary focus:ring-primary"
                                    checked={field.value?.includes(
                                      department.id
                                    )}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        field.onChange([
                                          ...(field.value || []),
                                          department.id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          field.value?.filter(
                                            (value) => value !== department.id
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {department.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="positions">
            <AccordionTrigger>Chức vụ</AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="positionIds"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Chọn chức vụ</FormLabel>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {positions.map((position) => (
                        <FormField
                          key={position.id}
                          control={form.control}
                          name="positionIds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={position.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 mt-1 text-primary focus:ring-primary"
                                    checked={field.value?.includes(position.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        field.onChange([
                                          ...(field.value || []),
                                          position.id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          field.value?.filter(
                                            (value) => value !== position.id
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {position.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">Lưu</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
