import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import EmployeeForm from '@/components/employee/EmployeeForm';
import { EmployeeFormValues } from '@/components/employee/form/types';
import { Card, CardContent } from '@/components/ui/card';

const AddEmployeePage = () => {
  const navigate = useNavigate();
  
  // Get data and functions from the store
  const { addEmployee } = useAppStore();
  
  // Handle adding a new employee
  const handleAddEmployee = (formData: EmployeeFormValues) => {
    console.log("Adding employee with data:", formData);
    
    // Clean up the formData before sending to the store
    // Remove the originalIdPhoto which is only used for editing
    const { originalIdPhoto, ...cleanFormData } = formData;
    
    // Make sure departmentIds and positionIds are passed to the store action
    addEmployee({
      ...cleanFormData,
      departmentIds: cleanFormData.departmentIds || [],
      positionIds: cleanFormData.positionIds || []
    });
    
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
      <div className="flex justify-between items-center bg-card rounded-lg p-4 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserPlus className="h-8 w-8 text-primary" />
            <span>Thêm nhân viên mới</span>
          </h1>
          <p className="text-muted-foreground mt-1">Nhập thông tin nhân viên mới vào biểu mẫu dưới đây</p>
        </div>
        
        <Button variant="outline" className="flex gap-2 shadow-sm hover:shadow-md transition-all" onClick={() => navigate('/employees')}>
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Button>
      </div>
      
      <Card className="bg-card border rounded-lg shadow-sm">
        <CardContent className="p-6">
          <div className="max-w-4xl mx-auto">
            <EmployeeForm
              onSubmit={handleAddEmployee}
              onCancel={handleCancel}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AddEmployeePage;
