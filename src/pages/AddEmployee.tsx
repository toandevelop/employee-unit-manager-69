
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const AddEmployeePage = () => {
  const navigate = useNavigate();
  const { 
    departments, 
    positions, 
    academicDegrees,
    academicTitles,
    addEmployee
  } = useAppStore();
  
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
  
  // Handle adding a new employee
  const handleAddEmployee = () => {
    // Validate form
    if (!formData.code || !formData.name || !formData.address || 
        !formData.phone || !formData.identityCard || !formData.contractDate) {
      toast.error("Vui lòng điền đầy đủ thông tin cá nhân");
      return;
    }
    
    if (formData.departmentIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một đơn vị");
      return;
    }
    
    if (formData.positionIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một chức vụ");
      return;
    }
    
    addEmployee(formData);
    toast.success("Thêm nhân viên thành công");
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
            formData={formData}
            setFormData={setFormData}
            departments={departments}
            positions={positions}
            academicDegrees={academicDegrees}
            academicTitles={academicTitles}
            onSubmit={handleAddEmployee}
            submitButtonText="Thêm nhân viên"
          />
        </div>
      </div>
    </motion.div>
  );
};

// Import the EmployeeForm component
import EmployeeForm from '@/components/employee/EmployeeForm';

export default AddEmployeePage;
