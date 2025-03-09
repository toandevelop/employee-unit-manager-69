
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="py-4 space-y-6">
      <Card className="shadow-sm border-input/40">
        <CardContent className="p-0">
          <BasicInfoFieldset 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border-input/40">
        <CardContent className="p-0">
          <AcademicInfoFieldset 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border-input/40">
        <CardContent className="p-6 pt-4">
          <h3 className="text-lg font-medium border-b pb-2 mb-4">Thông tin phòng ban & vị trí</h3>
          <div className="space-y-6">
            <DepartmentsFieldset 
              formData={formData} 
              setFormData={setFormData} 
            />
            
            <PositionsFieldset 
              formData={formData} 
              setFormData={setFormData} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
