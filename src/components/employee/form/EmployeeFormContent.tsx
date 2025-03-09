
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmployeeFormValues } from './types';
import { DepartmentsFieldset } from './DepartmentsFieldset';
import { PositionsFieldset } from './PositionsFieldset';
import { BasicInfoFieldset } from './BasicInfoFieldset';
import { AcademicInfoFieldset } from './AcademicInfoFieldset';

interface EmployeeFormContentProps {
  formData: EmployeeFormValues;
  setFormData: React.Dispatch<React.SetStateAction<EmployeeFormValues>>;
}

export const EmployeeFormContent = ({ formData, setFormData }: EmployeeFormContentProps) => {
  // Handle form input change
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid gap-4 py-4">
      <BasicInfoFieldset 
        formData={formData} 
        handleInputChange={handleInputChange} 
      />
      
      <AcademicInfoFieldset 
        formData={formData} 
        handleInputChange={handleInputChange} 
      />
      
      <DepartmentsFieldset 
        formData={formData} 
        setFormData={setFormData} 
      />
      
      <PositionsFieldset 
        formData={formData} 
        setFormData={setFormData} 
      />
    </div>
  );
};
