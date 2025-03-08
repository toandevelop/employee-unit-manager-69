
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  User, 
  Building2, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Pencil, 
  Trash2, 
  X, 
  Check 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { useAppStore } from '@/store';
import { Employee } from '@/types';

const EmployeesPage = () => {
  const { 
    employees, 
    departments, 
    positions, 
    departmentEmployees, 
    positionEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
  } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    address: string;
    phone: string;
    identityCard: string;
    contractDate: string;
    departmentIds: string[];
    positionIds: string[];
  }>({
    code: '',
    name: '',
    address: '',
    phone: '',
    identityCard: '',
    contractDate: '',
    departmentIds: [],
    positionIds: []
  });
  
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Helper function to get departments for an employee
  const getEmployeeDepartments = (employeeId: string) => {
    const departmentIds = departmentEmployees
      .filter(de => de.employeeId === employeeId)
      .map(de => de.departmentId);
    
    return departments.filter(dept => departmentIds.includes(dept.id));
  };
  
  // Helper function to get positions for an employee
  const getEmployeePositions = (employeeId: string) => {
    const positionIds = positionEmployees
      .filter(pe => pe.employeeId === employeeId)
      .map(pe => pe.positionId);
    
    return positions.filter(pos => positionIds.includes(pos.id));
  };
  
  // Reset form data
  const resetFormData = () => {
    setFormData({
      code: '',
      name: '',
      address: '',
      phone: '',
      identityCard: '',
      contractDate: '',
      departmentIds: [],
      positionIds: []
    });
  };
  
  // Handle adding a new employee
  const handleAddEmployee = () => {
    addEmployee(formData);
    setIsAddDialogOpen(false);
    resetFormData();
  };
  
  // Set up form for editing
  const handleEditClick = (employee: Employee) => {
    const departmentIds = departmentEmployees
      .filter(de => de.employeeId === employee.id)
      .map(de => de.departmentId);
    
    const positionIds = positionEmployees
      .filter(pe => pe.employeeId === employee.id)
      .map(pe => pe.positionId);
    
    setFormData({
      code: employee.code,
      name: employee.name,
      address: employee.address,
      phone: employee.phone,
      identityCard: employee.identityCard,
      contractDate: employee.contractDate,
      departmentIds,
      positionIds
    });
    
    setEditingEmployee(employee.id);
    setIsEditDialogOpen(true);
  };
  
  // Handle updating an employee
  const handleUpdateEmployee = () => {
    if (editingEmployee) {
      updateEmployee(editingEmployee, formData);
      setIsEditDialogOpen(false);
      setEditingEmployee(null);
      resetFormData();
    }
  };
  
  // Handle department checkbox change
  const handleDepartmentChange = (departmentId: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return { ...prev, departmentIds: [...prev.departmentIds, departmentId] };
      } else {
        return { ...prev, departmentIds: prev.departmentIds.filter(id => id !== departmentId) };
      }
    });
  };
  
  // Handle position checkbox change
  const handlePositionChange = (positionId: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return { ...prev, positionIds: [...prev.positionIds, positionId] };
      } else {
        return { ...prev, positionIds: prev.positionIds.filter(id => id !== positionId) };
      }
    });
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý nhân viên</h1>
          <p className="text-muted-foreground mt-1">Quản lý thông tin nhân viên trong công ty</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-2 shadow-md hover:shadow-lg transition-all">
              <Plus className="h-4 w-4" />
              <span>Thêm nhân viên</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm nhân viên mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin nhân viên mới vào biểu mẫu dưới đây
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Mã nhân viên</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="VD: NV001"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="VD: Số 1, Đường ABC, Quận XYZ, TP. Hà Nội"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="VD: 0901234567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="identityCard">Số CCCD</Label>
                  <Input
                    id="identityCard"
                    value={formData.identityCard}
                    onChange={(e) => setFormData({ ...formData, identityCard: e.target.value })}
                    placeholder="VD: 001201012345"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contractDate">Ngày ký hợp đồng chính thức</Label>
                <Input
                  id="contractDate"
                  type="date"
                  value={formData.contractDate}
                  onChange={(e) => setFormData({ ...formData, contractDate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Đơn vị</Label>
                <div className="grid grid-cols-2 gap-2 p-2 border rounded-md max-h-48 overflow-y-auto">
                  {departments.map((department) => (
                    <div className="flex items-center space-x-2" key={department.id}>
                      <Checkbox
                        id={`department-${department.id}`}
                        checked={formData.departmentIds.includes(department.id)}
                        onCheckedChange={(checked) => 
                          handleDepartmentChange(department.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`department-${department.id}`} className="font-normal">
                        {department.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Chức vụ</Label>
                <div className="grid grid-cols-2 gap-2 p-2 border rounded-md max-h-48 overflow-y-auto">
                  {positions.map((position) => (
                    <div className="flex items-center space-x-2" key={position.id}>
                      <Checkbox
                        id={`position-${position.id}`}
                        checked={formData.positionIds.includes(position.id)}
                        onCheckedChange={(checked) => 
                          handlePositionChange(position.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`position-${position.id}`} className="font-normal">
                        {position.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddEmployee}>Thêm nhân viên</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm nhân viên theo mã hoặc tên..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredEmployees.length > 0 ? filteredEmployees.map((employee) => {
          const employeeDepartments = getEmployeeDepartments(employee.id);
          const employeePositions = getEmployeePositions(employee.id);
          
          return (
            <motion.div key={employee.id} variants={cardVariants}>
              <Card className="overflow-hidden hover:shadow-md transition-all-300">
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-bold">{employee.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {employee.code}
                      </CardDescription>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-primary"
                        onClick={() => handleEditClick(employee)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa nhân viên</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa nhân viên "{employee.name}"? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deleteEmployee(employee.id)}
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">Chức vụ:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {employeePositions.map(position => (
                            <Badge key={position.id} variant="secondary">
                              {position.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">Đơn vị:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {employeeDepartments.map(department => (
                            <Badge key={department.id} variant="outline">
                              {department.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>CCCD: {employee.identityCard}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Ngày ký HĐ: {new Date(employee.contractDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        }) : (
          <div className="col-span-3 flex justify-center py-12">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">Không tìm thấy nhân viên nào</p>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin nhân viên</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin nhân viên trong biểu mẫu dưới đây
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Mã nhân viên</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-name">Họ và tên</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-address">Địa chỉ</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Số điện thoại</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-identityCard">Số CCCD</Label>
                <Input
                  id="edit-identityCard"
                  value={formData.identityCard}
                  onChange={(e) => setFormData({ ...formData, identityCard: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-contractDate">Ngày ký hợp đồng chính thức</Label>
              <Input
                id="edit-contractDate"
                type="date"
                value={formData.contractDate}
                onChange={(e) => setFormData({ ...formData, contractDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Đơn vị</Label>
              <div className="grid grid-cols-2 gap-2 p-2 border rounded-md max-h-48 overflow-y-auto">
                {departments.map((department) => (
                  <div className="flex items-center space-x-2" key={department.id}>
                    <Checkbox
                      id={`edit-department-${department.id}`}
                      checked={formData.departmentIds.includes(department.id)}
                      onCheckedChange={(checked) => 
                        handleDepartmentChange(department.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`edit-department-${department.id}`} className="font-normal">
                      {department.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Chức vụ</Label>
              <div className="grid grid-cols-2 gap-2 p-2 border rounded-md max-h-48 overflow-y-auto">
                {positions.map((position) => (
                  <div className="flex items-center space-x-2" key={position.id}>
                    <Checkbox
                      id={`edit-position-${position.id}`}
                      checked={formData.positionIds.includes(position.id)}
                      onCheckedChange={(checked) => 
                        handlePositionChange(position.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`edit-position-${position.id}`} className="font-normal">
                      {position.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingEmployee(null);
              resetFormData();
            }}>
              Hủy
            </Button>
            <Button onClick={handleUpdateEmployee}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesPage;
