
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Employee } from '@/types';
import { CardTemplate } from '@/types/cardTemplate';
import { useEmployeeHelpers } from '@/hooks/useEmployeeHelpers';
import QRCode from 'react-qr-code';
import { useAppStore } from '@/store';

interface EmployeeCardTemplateProps {
  employee: Employee;
  template?: CardTemplate;
}

const EmployeeCardTemplate: React.FC<EmployeeCardTemplateProps> = ({ 
  employee,
  template = {
    id: 'default',
    name: 'Default Template',
    organizationId: '',
    backgroundColor: 'white',
    headerColor: 'bg-primary',
    textColor: 'text-gray-800',
    qrCodePosition: 'bottom',
    showLogo: true
  }
}) => {
  const { getEmployeePositions, getEmployeeDepartments } = useEmployeeHelpers();
  const { organizations } = useAppStore();
  
  const departments = getEmployeeDepartments(employee.id);
  const positions = getEmployeePositions(employee.id);
  
  const organization = departments.length > 0 
    ? organizations.find(org => org.id === departments[0].organizationId)
    : null;
  
  const organizationName = organization?.name || "Trường đại học Nam Cần Thơ";
  const primaryPosition = positions.length > 0 ? positions[0].name : "";
  const primaryDepartment = departments.length > 0 ? departments[0].name : "";

  return (
    <div 
      className={`relative w-[340px] h-[540px] border-2 border-gray-200 rounded-xl shadow-lg flex flex-col items-center overflow-hidden`}
      style={{ backgroundColor: template.backgroundColor }}
    >
      {/* Card Header with Organization */}
      <div className={`w-full ${template.headerColor} text-white py-4 px-3 text-center flex flex-col items-center`}>
        {template.showLogo && organization?.logo && (
          <img 
            src={organization.logo} 
            alt={organizationName}
            className="h-8 mb-2"
          />
        )}
        <div className="text-lg font-bold">{organizationName}</div>
        <div className="text-sm mt-1">EMPLOYEE CARD</div>
      </div>
      
      {/* Main Content */}
      <div className={`flex flex-col items-center ${template.qrCodePosition === 'right' ? 'flex-row' : 'flex-col'} flex-1 p-6 w-full`}>
        <div className={`flex flex-col items-center ${template.qrCodePosition === 'right' ? 'w-2/3' : 'w-full'}`}>
          {/* Photo */}
          <div className="mt-4 w-32 h-[10.5rem] border border-gray-200 rounded overflow-hidden">
            {employee.idPhoto ? (
              <img 
                src={employee.idPhoto} 
                alt={employee.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Avatar className="w-full h-full">
                <AvatarFallback className="text-4xl bg-secondary text-secondary-foreground">
                  {employee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          
          {/* Employee Info */}
          <div className={`mt-4 text-center px-4 ${template.textColor}`}>
            <h2 className="text-xl font-bold">{employee.name}</h2>
            <p className="text-primary font-medium mt-1">{primaryPosition}</p>
            <p className="text-gray-600 mt-1">{primaryDepartment}</p>
            
            <div className="mt-6 border-t border-b border-gray-200 py-4 px-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Mã nhân viên:</span>
                <span className="font-medium">{employee.code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Ngày hợp đồng:</span>
                <span className="font-medium">
                  {new Date(employee.contractDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* QR Code */}
        <div className={`
          ${template.qrCodePosition === 'right' ? 'w-1/3 h-full flex items-center justify-center' : 'mb-6 mt-auto'}
        `}>
          <div className="text-center">
            <QRCode 
              value={employee.code} 
              size={100} 
              level="H" 
              className="mx-auto" 
            />
            <p className="text-xs text-gray-500 text-center mt-2">Quét mã để xem thông tin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCardTemplate;
