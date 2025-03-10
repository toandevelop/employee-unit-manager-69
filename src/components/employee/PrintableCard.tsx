
import React, { forwardRef } from 'react';
import { Employee } from '@/types';
import { CardTemplate } from '@/types/cardTemplate';
import { useEmployeeHelpers } from '@/hooks/useEmployeeHelpers';
import QRCode from 'react-qr-code';
import { useAppStore } from '@/store';

interface PrintableCardProps {
  employee: Employee;
  template?: CardTemplate;
}

const PrintableCard = forwardRef<HTMLDivElement, PrintableCardProps>(
  ({ employee, template }, ref) => {
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

    const defaultTemplate: CardTemplate = {
      id: 'default',
      name: 'Default Template',
      organizationId: '',
      backgroundColor: 'white',
      headerColor: '#1a73e8',
      textColor: '#333333',
      qrCodePosition: 'bottom',
      showLogo: true
    };

    const activeTemplate = template || defaultTemplate;
  
    return (
      <div 
        ref={ref} 
        className="w-[8.5cm] h-[5.4cm] overflow-hidden print:shadow-none"
        style={{ 
          border: '1px solid #ddd',
          boxSizing: 'border-box',
          pageBreakInside: 'avoid',
          position: 'relative',
          backgroundColor: activeTemplate.backgroundColor
        }}
      >
        {/* Card Header with Organization */}
        <div 
          style={{ 
            width: '100%', 
            background: typeof activeTemplate.headerColor === 'string' && activeTemplate.headerColor.startsWith('bg-')
              ? undefined
              : activeTemplate.headerColor,
            color: 'white', 
            padding: '6px', 
            textAlign: 'center',
            fontSize: '10px',
            fontWeight: 'bold'
          }}
          className={typeof activeTemplate.headerColor === 'string' && activeTemplate.headerColor.startsWith('bg-')
            ? activeTemplate.headerColor
            : undefined}
        >
          {activeTemplate.showLogo && organization?.logo1 && (
            <img 
              src={organization.logo1} 
              alt={organizationName}
              style={{ height: '16px', marginBottom: '4px', display: 'inline-block' }}
            />
          )}
          <div>{organizationName}</div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          padding: '8px',
          color: activeTemplate.textColor
        }}>
          {/* Photo */}
          <div 
            style={{ 
              width: '2.5cm', 
              height: '3.3cm',
              border: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundColor: '#f5f5f5'
            }}
          >
            {employee.idPhoto ? (
              <img 
                src={employee.idPhoto} 
                alt={employee.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '24px',
                color: '#aaa'
              }}>
                {employee.name.charAt(0)}
              </div>
            )}
          </div>
          
          {/* Info */}
          <div style={{ 
            flex: 1, 
            padding: '0 6px',
            fontSize: '9px',
            marginLeft: '8px'
          }}>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '12px',
              marginBottom: '4px',
              color: '#333'
            }}>
              {employee.name}
            </div>
            
            <div style={{ 
              fontWeight: 'bold',
              color: '#1a73e8',
              marginBottom: '2px',
              fontSize: '10px'
            }}>
              {primaryPosition}
            </div>
            
            <div style={{ 
              color: '#666',
              marginBottom: '8px',
              fontSize: '9px'
            }}>
              {primaryDepartment}
            </div>
            
            <table style={{ borderSpacing: '0', width: '100%', fontSize: '8px' }}>
              <tbody>
                <tr>
                  <td style={{ color: '#777', paddingBottom: '2px' }}>Mã NV:</td>
                  <td style={{ fontWeight: 'bold', paddingBottom: '2px' }}>{employee.code}</td>
                </tr>
                <tr>
                  <td style={{ color: '#777', paddingBottom: '2px' }}>Ngày HĐ:</td>
                  <td style={{ fontWeight: 'bold', paddingBottom: '2px' }}>
                    {new Date(employee.contractDate).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              </tbody>
            </table>
            
            {/* QR Code - Conditionally positioned */}
            {activeTemplate.qrCodePosition === 'right' ? (
              <div style={{ 
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '4px'
              }}>
                <QRCode 
                  value={employee.code} 
                  size={60} 
                  level="M"
                  style={{ height: 'auto', maxWidth: '100%', width: '60px' }}
                />
              </div>
            ) : null}
          </div>
        </div>
        
        {/* Bottom QR Code */}
        {activeTemplate.qrCodePosition === 'bottom' && (
          <div style={{ 
            position: 'absolute',
            bottom: '8px',
            right: '8px',
          }}>
            <QRCode 
              value={employee.code} 
              size={60} 
              level="M"
              style={{ height: 'auto', maxWidth: '100%', width: '60px' }}
            />
          </div>
        )}
        
        {/* Footer */}
        <div style={{ 
          fontSize: '7px',
          color: '#999',
          position: 'absolute',
          bottom: '3px',
          right: '8px'
        }}>
          ID: {employee.code}
        </div>
      </div>
    );
  }
);

PrintableCard.displayName = "PrintableCard";
export default PrintableCard;
