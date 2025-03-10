
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface LogoUploaderProps {
  logoUrl: string;
  logoType: 'logo1' | 'logo2' | 'logo3';
  logoTitle: string;
  onLogoChange: (logoType: 'logo1' | 'logo2' | 'logo3', logoUrl: string) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({
  logoUrl,
  logoType,
  logoTitle,
  onLogoChange
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ chấp nhận file hình ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    setIsUploading(true);

    // Convert file to base64 string for storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      onLogoChange(logoType, base64String);
      setIsUploading(false);
    };
    reader.onerror = () => {
      toast.error('Không thể đọc file, vui lòng thử lại');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onLogoChange(logoType, '');
  };

  return (
    <div className="space-y-3 p-4 border rounded-md">
      <div className="flex justify-between items-center">
        <Label className="font-medium">{logoTitle}</Label>
        
        {logoUrl && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRemoveLogo}
            className="text-destructive h-8 px-2"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Xóa
          </Button>
        )}
      </div>
      
      {logoUrl ? (
        <div className="relative w-full h-36 border rounded-md overflow-hidden bg-gray-50">
          <img 
            src={logoUrl} 
            alt={`${logoTitle}`}
            className="w-full h-full object-contain p-2"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-36 border rounded-md bg-gray-50">
          <Image className="h-12 w-12 text-gray-300" />
          <p className="text-sm text-gray-500 mt-2">Chưa có logo</p>
        </div>
      )}
      
      <div className="pt-2">
        <Input
          type="file"
          accept="image/*"
          id={`logo-upload-${logoType}`}
          onChange={handleFileChange}
          className="hidden"
        />
        <Label 
          htmlFor={`logo-upload-${logoType}`}
          className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-white rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Đang tải...' : 'Tải logo lên'}
        </Label>
      </div>
    </div>
  );
};

export default LogoUploader;
