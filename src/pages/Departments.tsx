import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Calendar, 
  Users,
  Building2,
  Pencil, 
  Trash2,
  UserCog
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useAppStore } from '@/store';
import { Department } from '@/types';

const DepartmentsPage = () => {
  const { 
    departments, 
    employees, 
    departmentEmployees,
    addDepartment,
    updateDepartment,
    deleteDepartment
  } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    foundingDate: string;
    headId?: string;
  }>({
    code: '',
    name: '',
    foundingDate: '',
    headId: '',
  });
  
  const [editingDepartment, setEditingDepartment] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isHeadDialogOpen, setIsHeadDialogOpen] = useState(false);
  const [selectedDepartmentForHead, setSelectedDepartmentForHead] = useState<Department | null>(null);
  
  const filteredDepartments = departments.filter(department => 
    department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    department.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getDepartmentEmployees = (departmentId: string) => {
    const employeeIds = departmentEmployees
      .filter(de => de.departmentId === departmentId)
      .map(de => de.employeeId);
    
    return employees.filter(employee => employeeIds.includes(employee.id));
  };
  
  const getDepartmentHead = (headId?: string) => {
    if (!headId) return null;
    return employees.find(employee => employee.id === headId);
  };
  
  const resetFormData = () => {
    setFormData({
      code: '',
      name: '',
      foundingDate: '',
      headId: '',
    });
  };
  
  const handleAddDepartment = () => {
    addDepartment(formData);
    setIsAddDialogOpen(false);
    resetFormData();
  };
  
  const handleEditClick = (department: Department) => {
    setFormData({
      code: department.code,
      name: department.name,
      foundingDate: department.foundingDate,
      headId: department.headId,
    });
    
    setEditingDepartment(department.id);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateDepartment = () => {
    if (editingDepartment) {
      updateDepartment(editingDepartment, formData);
      setIsEditDialogOpen(false);
      setEditingDepartment(null);
      resetFormData();
    }
  };
  
  const handleSetDepartmentHead = (department: Department) => {
    setSelectedDepartmentForHead(department);
    setFormData(prev => ({
      ...prev,
      headId: department.headId || '',
    }));
    setIsHeadDialogOpen(true);
  };
  
  const handleSaveDepartmentHead = () => {
    if (selectedDepartmentForHead) {
      updateDepartment(selectedDepartmentForHead.id, { headId: formData.headId || undefined });
      setIsHeadDialogOpen(false);
      setSelectedDepartmentForHead(null);
    }
  };
  
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
  
  const getDepartmentEmployeesForSelect = (departmentId: string) => {
    if (!departmentId || !selectedDepartmentForHead) return employees;
    return getDepartmentEmployees(departmentId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý đơn vị</h1>
          <p className="text-muted-foreground mt-1">Quản lý thông tin các đơn vị trong công ty</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-2 shadow-md hover:shadow-lg transition-all">
              <Plus className="h-4 w-4" />
              <span>Thêm đơn vị</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm đơn vị mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin đơn vị mới vào biểu mẫu dưới đây
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã đơn vị</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="VD: IT"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Tên đơn vị</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Phòng Công nghệ thông tin"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="foundingDate">Ngày thành lập</Label>
                <Input
                  id="foundingDate"
                  type="date"
                  value={formData.foundingDate}
                  onChange={(e) => setFormData({ ...formData, foundingDate: e.target.value })}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddDepartment}>Thêm đơn vị</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm đơn vị theo mã hoặc tên..."
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
        {filteredDepartments.length > 0 ? filteredDepartments.map((department) => {
          const departmentEmployeesList = getDepartmentEmployees(department.id);
          const departmentHead = getDepartmentHead(department.headId);
          
          return (
            <motion.div key={department.id} variants={cardVariants}>
              <Card className="overflow-hidden hover:shadow-md transition-all-300">
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-bold">{department.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {department.code}
                      </CardDescription>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-primary"
                        onClick={() => handleSetDepartmentHead(department)}
                        title="Thiết lập người đứng đầu"
                      >
                        <UserCog className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-primary"
                        onClick={() => handleEditClick(department)}
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
                            <AlertDialogTitle>Xác nhận xóa đơn vị</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa đơn vị "{department.name}"? Hành động này không thể hoàn tác.
                              {departmentEmployeesList.length > 0 && (
                                <div className="mt-2 text-destructive font-medium">
                                  Lưu ý: Không thể xóa đơn vị đang có nhân viên làm việc.
                                </div>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deleteDepartment(department.id)}
                              disabled={departmentEmployeesList.length > 0}
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
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Ngày thành lập: {new Date(department.foundingDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                    
                    {departmentHead && (
                      <div className="flex items-center gap-3 text-sm">
                        <UserCog className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <span className="font-medium">Người đứng đầu: </span>
                          <span>{departmentHead.name}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium mb-2">Nhân viên trong đơn vị ({departmentEmployeesList.length})</div>
                        <div className="flex flex-wrap gap-2">
                          {departmentEmployeesList.length > 0 ? (
                            departmentEmployeesList.map(employee => (
                              <Badge key={employee.id} variant="outline" className="bg-secondary/50">
                                {employee.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">Chưa có nhân viên</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        }) : (
          <div className="col-span-3 flex justify-center py-12">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">Không tìm thấy đơn vị nào</p>
            </div>
          </div>
        )}
      </motion.div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin đơn vị</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin đơn vị trong biểu mẫu dưới đây
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Mã đơn vị</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên đơn vị</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-foundingDate">Ngày thành lập</Label>
              <Input
                id="edit-foundingDate"
                type="date"
                value={formData.foundingDate}
                onChange={(e) => setFormData({ ...formData, foundingDate: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingDepartment(null);
              resetFormData();
            }}>
              Hủy
            </Button>
            <Button onClick={handleUpdateDepartment}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isHeadDialogOpen} onOpenChange={setIsHeadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thiết lập người đứng đầu đơn vị</DialogTitle>
            <DialogDescription>
              Chọn nhân viên làm người đứng đầu đơn vị {selectedDepartmentForHead?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="head-employee">Người đứng đầu</Label>
              <Select 
                value={formData.headId || ""} 
                onValueChange={(value) => setFormData({ ...formData, headId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhân viên làm người đứng đầu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không có người đứng đầu</SelectItem>
                  {selectedDepartmentForHead && getDepartmentEmployeesForSelect(selectedDepartmentForHead.id).map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} ({employee.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDepartmentForHead && getDepartmentEmployeesForSelect(selectedDepartmentForHead.id).length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Không có nhân viên nào trong đơn vị này. Hãy thêm nhân viên vào đơn vị trước khi chọn người đứng đầu.
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsHeadDialogOpen(false);
              setSelectedDepartmentForHead(null);
            }}>
              Hủy
            </Button>
            <Button 
              onClick={handleSaveDepartmentHead}
              disabled={selectedDepartmentForHead && getDepartmentEmployeesForSelect(selectedDepartmentForHead.id).length === 0}
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentsPage;
