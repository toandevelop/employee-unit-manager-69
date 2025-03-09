
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmployeeFormValues } from './types';
import { User, MapPin, Phone, CreditCard, Calendar } from 'lucide-react';

interface BasicInfoFieldsetProps {
  formData: EmployeeFormValues;
  handleInputChange: (field: string, value: string) => void;
}

export const BasicInfoFieldset = ({ formData, handleInputChange }: BasicInfoFieldsetProps) => {
  return (
    <div className="space-y-6 p-2">
      <h3 className="text-lg font-medium border-b pb-2 mb-4">Thông tin cơ bản</h3>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Mã nhân viên</span>
          </Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => handleInputChange('code', e.target.value)}
            placeholder="VD: NV001"
            className="border-input/60 focus:border-primary"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Họ và tên</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="VD: Nguyễn Văn A"
            className="border-input/60 focus:border-primary"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>Địa chỉ</span>
        </Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="VD: Số 1, Đường ABC, Quận XYZ, TP. Hà Nội"
          className="border-input/60 focus:border-primary"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>Số điện thoại</span>
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="VD: 0901234567"
            className="border-input/60 focus:border-primary"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="identityCard" className="text-sm font-medium flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span>Số CCCD</span>
          </Label>
          <Input
            id="identityCard"
            value={formData.identityCard}
            onChange={(e) => handleInputChange('identityCard', e.target.value)}
            placeholder="VD: 001201012345"
            className="border-input/60 focus:border-primary"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contractDate" className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Ngày ký hợp đồng chính thức</span>
        </Label>
        <Input
          id="contractDate"
          type="date"
          value={formData.contractDate}
          onChange={(e) => handleInputChange('contractDate', e.target.value)}
          className="border-input/60 focus:border-primary"
        />
      </div>
    </div>
  );
};
