
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';
import { Employee } from '@/types';
import EmployeeSearch from '@/components/employee/EmployeeSearch';
import EmployeeList from '@/components/employee/EmployeeList';
import EmployeeFormDialog from '@/components/employee/EmployeeFormDialog';
import { motion } from 'framer-motion';

const EmployeesPage = () => {
  const navigate = useNavigate();
  const { 
    employees, 
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
    academicDegreeId?: string;
    academicTitleId?: string;
  }>({
    code: '',
    name: '',
    address: '',
    phone: '',
    identityCard: '',
    contractDate: '',
    departmentIds: [],
    positionIds: [],
    academicDegreeId: undefined,
    academicTitleId: undefined
  });
  
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
      positionIds: [],
      academicDegreeId: undefined,
      academicTitleId: undefined
    });
  };
  
  // Set up form for editing
  const handleEditClick = (employee: Employee) => {
    // Get department IDs for this employee
    const departmentIds = employee.departmentEmployees
      .map(de => de.departmentId);
    
    // Get position IDs for this employee
    const positionIds = employee.positionEmployees
      .map(pe => pe.positionId);
    
    setFormData({
      code: employee.code,
      name: employee.name,
      address: employee.address,
      phone: employee.phone,
      identityCard: employee.identityCard,
      contractDate: employee.contractDate,
      departmentIds,
      positionIds,
      academicDegreeId: employee.academicDegreeId,
      academicTitleId: employee.academicTitleId
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
  
  // Handle cancel edit
  const handleCancel = () => {
    setIsEditDialogOpen(false);
    setEditingEmployee(null);
    resetFormData();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý nhân viên</h1>
          <p className="text-muted-foreground mt-1">Quản lý thông tin nhân viên trong công ty</p>
        </div>
        
        <Button 
          className="flex gap-2 shadow-md hover:shadow-lg transition-all"
          onClick={() => navigate('/employees/add')}
        >
          <Plus className="h-4 w-4" />
          <span>Thêm nhân viên</span>
        </Button>
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
      <EmployeeFormDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        departments={[]}
        positions={[]}
        academicDegrees={[]}
        academicTitles={[]}
        onSubmit={handleUpdateEmployee}
        isEditing={true}
        onCancel={handleCancel}
      />
    </motion.div>
  );
};

export default EmployeesPage;
