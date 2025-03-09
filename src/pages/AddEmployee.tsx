
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import EmployeeForm from '@/components/employee/EmployeeForm';
import { EmployeeFormValues } from '@/components/employee/form/types';

const AddEmployeePage = () => {
  const navigate = useNavigate();
  
  // Get data and functions from the store
  const { addEmployee } = useAppStore();
  
  // Handle adding a new employee
  const handleAddEmployee = (formData: EmployeeFormValues) => {
    // Validation is handled inside the EmployeeForm component
    addEmployee(formData);
    toast.success("Thêm nhân viên thành công");
    navigate('/employees');
  };
  
  const handleCancel = () => {
    navigate('/employees');
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
          <h1 className="text-3xl font-bold">Thêm nhân viên mới</h1>
          <p className="text-muted-foreground mt-1">Nhập thông tin nhân viên mới vào biểu mẫu dưới đây</p>
        </div>
        
        <Button variant="outline" className="flex gap-2" onClick={() => navigate('/employees')}>
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Button>
      </div>
      
      <div className="bg-card border rounded-lg shadow-sm p-6">
        <div className="max-w-4xl mx-auto">
          <EmployeeForm
            onSubmit={handleAddEmployee}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AddEmployeePage;
