
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardTemplate } from '@/types/cardTemplate';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CirclePlus, Edit, Eye, Save } from 'lucide-react';
import EmployeeCardTemplate from './EmployeeCardTemplate';
import { useAppStore } from '@/store';

interface CardTemplateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: CardTemplate;
  onSave: (template: CardTemplate) => void;
  isNew?: boolean;
}

const CardTemplateEditor: React.FC<CardTemplateEditorProps> = ({
  open,
  onOpenChange,
  template,
  onSave,
  isNew = false
}) => {
  const [editedTemplate, setEditedTemplate] = useState<CardTemplate>(template);
  const { employees, organizations } = useAppStore();

  // Preview with a sample employee
  const sampleEmployee = employees[0] || null;

  const handleChange = (field: keyof CardTemplate, value: any) => {
    setEditedTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(editedTemplate);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isNew ? (
              <>
                <CirclePlus className="h-5 w-5" />
                Tạo mẫu thẻ mới
              </>
            ) : (
              <>
                <Edit className="h-5 w-5" />
                Chỉnh sửa mẫu thẻ
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Template Editor Controls */}
          <div className="space-y-6">
            <Tabs defaultValue="general">
              <TabsList className="w-full">
                <TabsTrigger value="general">Thông tin chung</TabsTrigger>
                <TabsTrigger value="colors">Màu sắc</TabsTrigger>
                <TabsTrigger value="layout">Bố cục</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên mẫu thẻ</Label>
                  <Input
                    id="name"
                    value={editedTemplate.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="org">Tổ chức</Label>
                  <Select 
                    value={editedTemplate.organizationId}
                    onValueChange={(value) => handleChange('organizationId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tổ chức" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map(org => (
                        <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showLogo">Hiển thị logo</Label>
                  <Switch
                    id="showLogo"
                    checked={editedTemplate.showLogo}
                    onCheckedChange={(checked) => handleChange('showLogo', checked)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="colors" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Màu nền</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="backgroundColor"
                      type="color"
                      className="w-20 h-10 p-1"
                      value={editedTemplate.backgroundColor}
                      onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    />
                    <Input
                      value={editedTemplate.backgroundColor}
                      onChange={(e) => handleChange('backgroundColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headerColor">Màu header</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="headerColor"
                      type="color"
                      className="w-20 h-10 p-1"
                      value={editedTemplate.headerColor.startsWith('bg-') ? '#1a73e8' : editedTemplate.headerColor}
                      onChange={(e) => handleChange('headerColor', e.target.value)}
                    />
                    <Select
                      value={editedTemplate.headerColor.startsWith('bg-') ? editedTemplate.headerColor : 'custom'}
                      onValueChange={(value) => {
                        if (value !== 'custom') {
                          handleChange('headerColor', value);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn màu header" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Tùy chỉnh</SelectItem>
                        <SelectItem value="bg-primary">Màu chính</SelectItem>
                        <SelectItem value="bg-blue-600">Xanh dương</SelectItem>
                        <SelectItem value="bg-green-600">Xanh lá</SelectItem>
                        <SelectItem value="bg-red-600">Đỏ</SelectItem>
                        <SelectItem value="bg-orange-600">Cam</SelectItem>
                        <SelectItem value="bg-purple-600">Tím</SelectItem>
                        <SelectItem value="bg-gray-800">Đen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor">Màu chữ</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="textColor"
                      type="color"
                      className="w-20 h-10 p-1"
                      value={editedTemplate.textColor.startsWith('text-') ? '#333333' : editedTemplate.textColor}
                      onChange={(e) => handleChange('textColor', e.target.value)}
                    />
                    <Select
                      value={editedTemplate.textColor.startsWith('text-') ? editedTemplate.textColor : 'custom'}
                      onValueChange={(value) => {
                        if (value !== 'custom') {
                          handleChange('textColor', value);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn màu chữ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Tùy chỉnh</SelectItem>
                        <SelectItem value="text-gray-800">Đen</SelectItem>
                        <SelectItem value="text-gray-600">Xám đậm</SelectItem>
                        <SelectItem value="text-gray-500">Xám nhạt</SelectItem>
                        <SelectItem value="text-primary">Màu chính</SelectItem>
                        <SelectItem value="text-blue-600">Xanh dương</SelectItem>
                        <SelectItem value="text-red-600">Đỏ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="qrCodePosition">Vị trí mã QR</Label>
                  <RadioGroup
                    value={editedTemplate.qrCodePosition}
                    onValueChange={(value: 'bottom' | 'right') => handleChange('qrCodePosition', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bottom" id="qr-bottom" />
                      <Label htmlFor="qr-bottom">Phía dưới</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="right" id="qr-right" />
                      <Label htmlFor="qr-right">Bên phải</Label>
                    </div>
                  </RadioGroup>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center">
            <div className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Xem trước
            </div>
            {sampleEmployee && (
              <EmployeeCardTemplate
                employee={sampleEmployee}
                template={editedTemplate}
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Lưu mẫu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CardTemplateEditor;
