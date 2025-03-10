
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmployeeFormValues } from './types';
import { User, MapPin, Phone, CreditCard, Calendar, ImagePlus, FileImage, Crop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';
import { IdPhotoCropper } from './IdPhotoCropper';

interface BasicInfoFieldsetProps {
  formData: EmployeeFormValues;
  handleInputChange: (field: string, value: string) => void;
}

export const BasicInfoFieldset = ({ formData, handleInputChange }: BasicInfoFieldsetProps) => {
  const [idPhotoError, setIdPhotoError] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

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

  const handleIdPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Reset error
      setIdPhotoError(null);
      
      // Read the file as data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        
        // Create image element to check dimensions
        const img = new Image();
        img.onload = () => {
          // Check if the aspect ratio is approximately 3:4 (with some tolerance)
          const aspectRatio = img.width / img.height;
          const targetRatio = 3 / 4;
          const tolerance = 0.1; // 10% tolerance

          if (Math.abs(aspectRatio - targetRatio) > tolerance) {
            // If the aspect ratio is incorrect, save the original image and open the cropper
            handleInputChange('originalIdPhoto', imageDataUrl);
            setShowCropper(true);
            return;
          }
          
          // If the aspect ratio is correct, save the image directly
          processAndSaveImage(img);
        };
        
        img.onerror = () => {
          setIdPhotoError("Không thể đọc tệp ảnh. Vui lòng chọn ảnh khác.");
        };
        
        img.src = imageDataUrl;
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleCroppedImage = (croppedImageDataUrl: string) => {
    handleInputChange('idPhoto', croppedImageDataUrl);
    handleInputChange('originalIdPhoto', ''); // Clear the original image
  };

  const processAndSaveImage = (img: HTMLImageElement) => {
    // Set dimensions for the canvas (standardize to reasonable size while maintaining aspect ratio)
    const maxWidth = 300;
    const maxHeight = 400;
    let width = img.width;
    let height = img.height;
    
    if (width > maxWidth) {
      height = (maxWidth / width) * height;
      width = maxWidth;
    }
    
    if (height > maxHeight) {
      width = (maxHeight / height) * width;
      height = maxHeight;
    }
    
    // Create canvas and draw the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    
    // Draw the image on the canvas
    ctx?.drawImage(img, 0, 0, width, height);
    
    // Get the compressed image as a data URL
    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    handleInputChange('idPhoto', compressedDataUrl);
  };

  return (
    <div className="space-y-6 p-6">
      <h3 className="text-lg font-medium border-b pb-2 mb-4">Thông tin cơ bản</h3>

      <div className="flex justify-center gap-10 mb-6">
        {/* Avatar upload */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground mb-2">Ảnh đại diện</p>
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

        {/* 3x4 ID Photo upload */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground mb-2">Ảnh thẻ 3x4</p>
          <div 
            className="w-24 h-32 mx-auto border rounded-md overflow-hidden cursor-pointer hover:border-primary transition-colors"
            onClick={() => formData.originalIdPhoto && setShowCropper(true)}
          >
            {formData.idPhoto ? (
              <img 
                src={formData.idPhoto} 
                alt="Ảnh thẻ 3x4" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <FileImage className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="idPhoto" className="cursor-pointer">
              <div className="flex items-center gap-2 text-sm text-primary hover:text-primary/80">
                <FileImage className="w-4 h-4" />
                <span>Tải lên ảnh thẻ</span>
              </div>
            </Label>
            <Input
              id="idPhoto"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleIdPhotoChange}
            />
            
            {formData.idPhoto && (
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs text-primary hover:text-primary/80"
                onClick={() => formData.originalIdPhoto ? setShowCropper(true) : null}
              >
                <Crop className="w-3 h-3 mr-1" />
                Cắt lại ảnh
              </Button>
            )}
          </div>
          {idPhotoError && (
            <p className="text-xs text-destructive mt-1">{idPhotoError}</p>
          )}
        </div>
      </div>
      
      {/* ID Photo Cropper Dialog */}
      {formData.originalIdPhoto && (
        <IdPhotoCropper
          open={showCropper}
          onOpenChange={setShowCropper}
          imageUrl={formData.originalIdPhoto}
          onCrop={handleCroppedImage}
        />
      )}
      
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
