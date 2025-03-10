
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Employee } from '@/types';
import { EmployeeFormValues } from './form/types';
import { FormActions } from './form/FormActions';
import { EmployeeFormContent } from './form/EmployeeFormContent';

interface EmployeeFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee;
  onSubmit: (formData: EmployeeFormValues) => void;
  onCancel: () => void;
}

const EmployeeFormDialog = ({
  isOpen,
  onOpenChange,
  employee,
  onSubmit,
  onCancel
}: EmployeeFormDialogProps) => {
  // Initialize formData from employee or with default values
  const [formData, setFormData] = useState<EmployeeFormValues>({
    code: employee?.code || '',
    name: employee?.name || '',
    address: employee?.address || '',
    phone: employee?.phone || '',
    identityCard: employee?.identityCard || '',
    contractDate: employee?.contractDate || '',
    departmentIds: employee?.departmentEmployees?.map(de => de.departmentId) || [],
    positionIds: employee?.positionEmployees?.map(pe => pe.positionId) || [],
    academicDegreeId: employee?.academicDegreeId || '',
    academicTitleId: employee?.academicTitleId || undefined,
    avatar: employee?.avatar || '',
    idPhoto: employee?.idPhoto || '',
    originalIdPhoto: '', // Initialize the original image field
  });

  // Update form data when employee changes
  useEffect(() => {
    if (employee) {
      setFormData({
        code: employee.code || '',
        name: employee.name || '',
        address: employee.address || '',
        phone: employee.phone || '',
        identityCard: employee.identityCard || '',
        contractDate: employee.contractDate || '',
        departmentIds: employee.departmentEmployees?.map(de => de.departmentId) || [],
        positionIds: employee.positionEmployees?.map(pe => pe.positionId) || [],
        academicDegreeId: employee.academicDegreeId || '',
        academicTitleId: employee.academicTitleId || undefined,
        avatar: employee.avatar || '',
        idPhoto: employee.idPhoto || '',
        originalIdPhoto: '', // Reset the original image field
      });
    }
  }, [employee]);

  // Validate form before submission
  const validateForm = () => {
    if (!formData.code || !formData.name || !formData.address || 
        !formData.phone || !formData.identityCard || !formData.contractDate) {
      return false;
    }
    
    if (formData.departmentIds.length === 0 || formData.positionIds.length === 0) {
      return false;
    }
    
    return true;
  };
  
  // Handle form submission - pass the formData to the parent's onSubmit handler
  const handleSubmit = () => {
    if (!validateForm()) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {employee?.id ? 'Chỉnh sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
          </DialogTitle>
          <DialogDescription>
            {employee?.id
              ? 'Cập nhật thông tin nhân viên trong biểu mẫu dưới đây'
              : 'Nhập thông tin nhân viên mới vào biểu mẫu dưới đây'
            }
          </DialogDescription>
        </DialogHeader>
        
        <EmployeeFormContent 
          formData={formData} 
          setFormData={setFormData} 
        />
        
        <FormActions onCancel={onCancel} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeFormDialog;
