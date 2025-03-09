
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { toast } from 'sonner';
import { useAppStore } from '@/store';
import { Contract, Employee } from '@/types';
import { ArrowLeft, Save, Building, Users } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Form validation schema
const contractSchema = z.object({
  code: z.string().min(1, "Mã hợp đồng không được để trống"),
  employeeId: z.string().min(1, "Vui lòng chọn nhân viên"),
  contractTypeId: z.string().min(1, "Vui lòng chọn loại hợp đồng"),
  startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  endDate: z.string().optional(),
  baseSalary: z.number().min(0, "Lương cơ bản không được nhỏ hơn 0"),
  allowance: z.number().min(0, "Phụ cấp không được nhỏ hơn 0")
});

type ContractFormValues = z.infer<typeof contractSchema>;

const AddContractPage = () => {
  const navigate = useNavigate();
  const { 
    employees, 
    departments, 
    departmentEmployees,
    contractTypes, 
    addContract 
  } = useAppStore();
  
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  
  // Setup form with default values
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      code: '',
      employeeId: '',
      contractTypeId: '',
      startDate: '',
      endDate: '',
      baseSalary: 0,
      allowance: 0
    }
  });
  
  // Filter employees by selected department
  const filteredEmployees = useMemo(() => {
    if (!selectedDepartmentId) return employees;
    
    const departmentEmployeeIds = departmentEmployees
      .filter(de => de.departmentId === selectedDepartmentId)
      .map(de => de.employeeId);
    
    return employees.filter(employee => 
      departmentEmployeeIds.includes(employee.id)
    );
  }, [employees, departmentEmployees, selectedDepartmentId]);
  
  // Calculate total salary
  const calculateTotalSalary = (baseSalary: number, allowance: number) => {
    return baseSalary + allowance;
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  
  // Watch for changes in baseSalary and allowance
  const baseSalary = form.watch('baseSalary') || 0;
  const allowance = form.watch('allowance') || 0;
  const totalSalary = calculateTotalSalary(baseSalary, allowance);
  
  // Handle form submission
  const onSubmit = (data: ContractFormValues) => {
    addContract({
      code: data.code,
      employeeId: data.employeeId,
      contractTypeId: data.contractTypeId,
      startDate: data.startDate,
      endDate: data.endDate,
      baseSalary: data.baseSalary,
      allowance: data.allowance
    });
    
    navigate('/contracts');
  };
  
  // Reset employee selection when department changes
  useEffect(() => {
    if (selectedDepartmentId) {
      form.setValue('employeeId', '');
    }
  }, [selectedDepartmentId, form]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="container mx-auto py-6"
    >
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => navigate('/contracts')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Thêm hợp đồng mới</h1>
          <p className="text-muted-foreground">Tạo hợp đồng mới cho nhân viên</p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Contract details */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Thông tin hợp đồng</CardTitle>
                <CardDescription>Nhập các thông tin cơ bản của hợp đồng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã hợp đồng</FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: HD001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contractTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại hợp đồng</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại hợp đồng" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent searchable>
                          {contractTypes.map((contractType) => (
                            <SelectItem key={contractType.id} value={contractType.id}>
                              {contractType.name}
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
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày kết thúc</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field}
                          placeholder="Để trống cho hợp đồng không thời hạn"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            {/* Middle column - Employee selection */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Thông tin nhân viên</CardTitle>
                <CardDescription>Chọn phòng ban và nhân viên</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="departmentId" className="mb-2 block">Phòng ban</Label>
                  <Select
                    value={selectedDepartmentId}
                    onValueChange={setSelectedDepartmentId}
                  >
                    <SelectTrigger className="w-full" id="departmentId">
                      <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Chọn phòng ban (không bắt buộc)" />
                    </SelectTrigger>
                    <SelectContent searchable>
                      <SelectItem value="">Tất cả phòng ban</SelectItem>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Chọn phòng ban để lọc danh sách nhân viên
                  </p>
                </div>
                
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhân viên</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Chọn nhân viên" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent searchable>
                          {filteredEmployees.length === 0 ? (
                            <div className="p-2 text-center text-muted-foreground">
                              Không tìm thấy nhân viên
                            </div>
                          ) : (
                            filteredEmployees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.code} - {employee.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch('employeeId') && (
                  <div className="p-3 border rounded-md bg-muted/30">
                    {(() => {
                      const selectedEmployee = employees.find(e => e.id === form.watch('employeeId'));
                      if (!selectedEmployee) return null;
                      
                      return (
                        <div className="space-y-1">
                          <p className="font-medium">{selectedEmployee.name}</p>
                          <p className="text-sm text-muted-foreground">Mã: {selectedEmployee.code}</p>
                          <p className="text-sm text-muted-foreground">SĐT: {selectedEmployee.phone}</p>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Right column - Salary information */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Thông tin lương</CardTitle>
                <CardDescription>Nhập thông tin lương và phụ cấp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="baseSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lương cơ bản (VNĐ)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="allowance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phụ cấp (VNĐ)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lương cơ bản:</span>
                    <span>{formatCurrency(baseSalary)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm">Phụ cấp:</span>
                    <span>{formatCurrency(allowance)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3 font-bold">
                    <span>Tổng lương:</span>
                    <span className="text-xl text-primary">{formatCurrency(totalSalary)}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Lưu hợp đồng
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default AddContractPage;
