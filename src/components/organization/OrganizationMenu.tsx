
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Building, 
  FileEdit, 
  FolderPlus, 
  Image, 
  MoreHorizontal, 
  Trash2 
} from 'lucide-react';
import { Organization } from '@/types';

interface OrganizationMenuProps {
  organization: Organization;
  onEdit: () => void;
  onAddDepartment: () => void;
  onManageLogos: () => void;
  onDelete: () => void;
  hasDepartments: boolean;
}

const OrganizationMenu: React.FC<OrganizationMenuProps> = ({
  organization,
  onEdit,
  onAddDepartment,
  onManageLogos,
  onDelete,
  hasDepartments
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          <span>{organization.name}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onEdit} className="flex items-center gap-2 cursor-pointer">
          <FileEdit className="h-4 w-4" />
          <span>Chỉnh sửa thông tin</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAddDepartment} className="flex items-center gap-2 cursor-pointer">
          <FolderPlus className="h-4 w-4" />
          <span>Thêm phòng ban</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onManageLogos} className="flex items-center gap-2 cursor-pointer">
          <Image className="h-4 w-4" />
          <span>Quản lý logo</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onDelete} 
          disabled={hasDepartments}
          className="flex items-center gap-2 text-destructive cursor-pointer focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span>Xóa tổ chức</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationMenu;
