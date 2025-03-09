
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Employee, Department, Position, AcademicDegree, AcademicTitle } from '@/types';

interface EmployeeFormData {
  code: string;
  name: string;
  address: string;
  phone: string;
  identityCard: string;
  contractDate: string;
  departmentIds: string[];
  positionIds: string[];
  academicDegreeId?: string;
  academicTitleId?: string;
}

interface EmployeeFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: EmployeeFormData;
  setFormData: React.Dispatch<React.SetStateAction<EmployeeFormData>>;
  departments: Department[];
  positions: Position[];
  academicDegrees: AcademicDegree[];
  academicTitles: AcademicTitle[];
  onSubmit: () => void;
  isEditing: boolean;
  onCancel: () => void;
}

const EmployeeFormDialog = ({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  departments,
  positions,
  academicDegrees,
  academicTitles,
  onSubmit,
  isEditing,
  onCancel
}: EmployeeFormDialogProps) => {
  
  // Handle department checkbox change
  const handleDepartmentChange = (departmentId: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return { ...prev, departmentIds: [...prev.departmentIds, departmentId] };
      } else {
        return { ...prev, departmentIds: prev.departmentIds.filter(id => id !== departmentId) };
      }
    });
  };
  
  // Handle position checkbox change
  const handlePositionChange = (positionId: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return { ...prev, positionIds: [...prev.positionIds, positionId] };
      } else {
        return { ...prev, positionIds: prev.positionIds.filter(id => id !== positionId) };
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Chỉnh sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Cập nhật thông tin nhân viên trong biểu mẫu dưới đây'
              : 'Nhập thông tin nhân viên mới vào biểu mẫu dưới đây'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã nhân viên</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="VD: NV001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Nguyễn Văn A"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="VD: Số 1, Đường ABC, Quận XYZ, TP. Hà Nội"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="VD: 0901234567"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="identityCard">Số CCCD</Label>
              <Input
                id="identityCard"
                value={formData.identityCard}
                onChange={(e) => setFormData({ ...formData, identityCard: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, contractDate: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academicDegree">Học vị</Label>
              <Select
                value={formData.academicDegreeId}
                onValueChange={(value) => setFormData({ ...formData, academicDegreeId: value })}
              >
                <SelectTrigger id="academicDegree">
                  <SelectValue placeholder="Chọn học vị" />
                </SelectTrigger>
                <SelectContent>
                  {academicDegrees.map((degree) => (
                    <SelectItem key={degree.id} value={degree.id}>
                      {degree.shortName} - {degree.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="academicTitle">Học hàm</Label>
              <Select
                value={formData.academicTitleId || ""}
                onValueChange={(value) => setFormData({ ...formData, academicTitleId: value || undefined })}
              >
                <SelectTrigger id="academicTitle">
                  <SelectValue placeholder="Chọn học hàm (nếu có)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Không có học hàm</SelectItem>
                  {academicTitles.map((title) => (
                    <SelectItem key={title.id} value={title.id}>
                      {title.shortName} - {title.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Đơn vị</Label>
            <div className="grid grid-cols-2 gap-2 p-2 border rounded-md max-h-48 overflow-y-auto">
              {departments.map((department) => (
                <div className="flex items-center space-x-2" key={department.id}>
                  <Checkbox
                    id={`department-${department.id}`}
                    checked={formData.departmentIds.includes(department.id)}
                    onCheckedChange={(checked) => 
                      handleDepartmentChange(department.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`department-${department.id}`} className="font-normal">
                    {department.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Chức vụ</Label>
            <div className="grid grid-cols-2 gap-2 p-2 border rounded-md max-h-48 overflow-y-auto">
              {positions.map((position) => (
                <div className="flex items-center space-x-2" key={position.id}>
                  <Checkbox
                    id={`position-${position.id}`}
                    checked={formData.positionIds.includes(position.id)}
                    onCheckedChange={(checked) => 
                      handlePositionChange(position.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`position-${position.id}`} className="font-normal">
                    {position.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button onClick={onSubmit}>
            {isEditing ? 'Lưu thay đổi' : 'Thêm nhân viên'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeFormDialog;
