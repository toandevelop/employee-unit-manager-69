
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useAppStore } from '@/store';
import { Employee } from '@/types';
import EmployeeSearch from '@/components/employee/EmployeeSearch';
import EmployeeList from '@/components/employee/EmployeeList';
import EmployeeFormDialog from '@/components/employee/EmployeeFormDialog';
import { EmployeeFormValues } from '@/components/employee/form/types';
import { toast } from 'sonner';

const EmployeesPage = () => {
  const { 
    employees, 
    addEmployee,
    updateEmployee,
    deleteEmployee
  } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle adding a new employee
  const handleAddEmployee = (formData: EmployeeFormValues) => {
    addEmployee(formData);
    setIsAddDialogOpen(false);
    toast.success("Thêm nhân viên thành công");
  };
  
  // Set up form for editing
  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee.id);
    setIsEditDialogOpen(true);
  };
  
  // Handle updating an employee
  const handleUpdateEmployee = (formData: EmployeeFormValues) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee, formData);
      setIsEditDialogOpen(false);
      setEditingEmployee(null);
      toast.success("Cập nhật thông tin nhân viên thành công");
    }
  };
  
  // Handle cancel edit/add
  const handleCancelAdd = () => {
    setIsAddDialogOpen(false);
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingEmployee(null);
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
          
          <EmployeeFormDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSubmit={handleAddEmployee}
            onCancel={handleCancelAdd}
          />
        </Dialog>
      </div>
      
      <EmployeeSearch 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <EmployeeList 
        employees={filteredEmployees}
        onEditClick={handleEditClick}
        onDeleteClick={deleteEmployee}
      />
      
      {/* Edit Employee Dialog */}
      {editingEmployee && (
        <EmployeeFormDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          employee={employees.find(e => e.id === editingEmployee)}
          onSubmit={handleUpdateEmployee}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default EmployeesPage;
