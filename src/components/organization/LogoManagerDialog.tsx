
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Organization } from '@/types';
import { Image } from 'lucide-react';
import LogoUploader from './LogoUploader';

interface LogoManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization;
  onLogoChange: (organizationId: string, logoType: 'logo1' | 'logo2' | 'logo3', logoUrl: string) => void;
}

const LogoManagerDialog: React.FC<LogoManagerDialogProps> = ({
  open,
  onOpenChange,
  organization,
  onLogoChange
}) => {
  const handleLogoChange = (logoType: 'logo1' | 'logo2' | 'logo3', logoUrl: string) => {
    onLogoChange(organization.id, logoType, logoUrl);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Quản lý logo tổ chức: {organization.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <LogoUploader
            logoUrl={organization.logo1 || ''}
            logoType="logo1"
            logoTitle="Logo chính"
            onLogoChange={handleLogoChange}
          />
          
          <LogoUploader
            logoUrl={organization.logo2 || ''}
            logoType="logo2"
            logoTitle="Logo phụ 1"
            onLogoChange={handleLogoChange}
          />
          
          <LogoUploader
            logoUrl={organization.logo3 || ''}
            logoType="logo3"
            logoTitle="Logo phụ 2"
            onLogoChange={handleLogoChange}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoManagerDialog;
