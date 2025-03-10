
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Employee } from '@/types';
import { useEmployeeHelpers } from '@/hooks/useEmployeeHelpers';
import QRCode from 'react-qr-code';
import { useAppStore } from '@/store';

interface EmployeeCardTemplateProps {
  employee: Employee;
}

const EmployeeCardTemplate: React.FC<EmployeeCardTemplateProps> = ({ employee }) => {
  const { getEmployeePositions, getEmployeeDepartments } = useEmployeeHelpers();
  const { organizations } = useAppStore();
  
  const departments = getEmployeeDepartments(employee.id);
  const positions = getEmployeePositions(employee.id);
  
  // Find organization based on employee's department
  const organization = departments.length > 0 
    ? organizations.find(org => org.id === departments[0].organizationId)
    : null;
  
  const organizationName = organization?.name || "Trường đại học Nam Cần Thơ";
  const primaryPosition = positions.length > 0 ? positions[0].name : "";
  const primaryDepartment = departments.length > 0 ? departments[0].name : "";

  return (
    <div className="relative w-[340px] h-[540px] bg-white border-2 border-gray-200 rounded-xl shadow-lg flex flex-col items-center overflow-hidden">
      {/* Card Header with Organization */}
      <div className="w-full bg-primary text-white py-4 px-3 text-center flex flex-col items-center">
        <div className="text-lg font-bold">{organizationName}</div>
        <div className="text-sm mt-1">EMPLOYEE CARD</div>
      </div>
      
      {/* Avatar */}
      <div className="mt-6">
        <Avatar className="w-32 h-32 border-4 border-gray-200">
          {employee.avatar ? (
            <AvatarImage src={employee.avatar} alt={employee.name} />
          ) : (
            <AvatarFallback className="text-4xl bg-secondary text-secondary-foreground">
              {employee.name.charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
      
      {/* Employee Info */}
      <div className="mt-4 text-center px-4 flex-1">
        <h2 className="text-xl font-bold text-gray-800">{employee.name}</h2>
        <p className="text-primary font-medium mt-1">{primaryPosition}</p>
        <p className="text-gray-600 mt-1">{primaryDepartment}</p>
        
        <div className="mt-6 border-t border-b border-gray-200 py-4 px-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-sm">Mã nhân viên:</span>
            <span className="font-medium">{employee.code}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Ngày hợp đồng:</span>
            <span className="font-medium">{new Date(employee.contractDate).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      </div>
      
      {/* QR Code */}
      <div className="mb-6 mt-auto">
        <QRCode 
          value={employee.code} 
          size={100} 
          level="H" 
          className="mx-auto" 
        />
        <p className="text-xs text-gray-500 text-center mt-2">Quét mã để xem thông tin</p>
      </div>
    </div>
  );
};

export default EmployeeCardTemplate;
