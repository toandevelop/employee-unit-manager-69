
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmployeeFormValues } from './types';

interface BasicInfoFieldsetProps {
  formData: EmployeeFormValues;
  handleInputChange: (field: string, value: string) => void;
}

export const BasicInfoFieldset = ({ formData, handleInputChange }: BasicInfoFieldsetProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Mã nhân viên</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => handleInputChange('code', e.target.value)}
            placeholder="VD: NV001"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Họ và tên</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="VD: Nguyễn Văn A"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Địa chỉ</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="VD: Số 1, Đường ABC, Quận XYZ, TP. Hà Nội"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="VD: 0901234567"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="identityCard">Số CCCD</Label>
          <Input
            id="identityCard"
            value={formData.identityCard}
            onChange={(e) => handleInputChange('identityCard', e.target.value)}
            placeholder="VD: 001201012345"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contractDate">Ngày ký hợp đồng chính thức</Label>
        <Input
          id="contractDate"
          type="date"
          value={formData.contractDate}
          onChange={(e) => handleInputChange('contractDate', e.target.value)}
        />
      </div>
    </>
  );
};
