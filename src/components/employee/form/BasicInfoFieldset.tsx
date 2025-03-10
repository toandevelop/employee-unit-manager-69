import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmployeeFormValues } from './types';
import { User, MapPin, Phone, CreditCard, Calendar, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface BasicInfoFieldsetProps {
  formData: EmployeeFormValues;
  handleInputChange: (field: string, value: string) => void;
}

export const BasicInfoFieldset = ({ formData, handleInputChange }: BasicInfoFieldsetProps) => {
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('avatar', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h3 className="text-lg font-medium border-b pb-2 mb-4">Thông tin cơ bản</h3>

      <div className="flex justify-center mb-6">
        <div className="text-center space-y-2">
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarImage src={formData.avatar} />
            <AvatarFallback>
              <User className="w-12 h-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="avatar" className="cursor-pointer">
              <div className="flex items-center gap-2 text-sm text-primary hover:text-primary/80">
                <ImagePlus className="w-4 h-4" />
                <span>Tải lên ảnh đại diện</span>
              </div>
            </Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
      </div>
      
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
