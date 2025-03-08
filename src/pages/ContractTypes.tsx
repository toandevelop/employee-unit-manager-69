
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useAppStore } from '@/store';
import { ContractType } from '@/types';
import { FileType, Plus, Pencil, Trash2 } from 'lucide-react';

const ContractTypesPage = () => {
  const { contractTypes, contracts, addContractType, updateContractType, deleteContractType } = useAppStore();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentContractType, setCurrentContractType] = useState<ContractType | null>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    name: ''
  });
  
  const resetForm = () => {
    setFormData({
      code: '',
      name: ''
    });
    setCurrentContractType(null);
  };
  
  const handleOpenAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };
  
  const handleOpenEditDialog = (contractType: ContractType) => {
    setCurrentContractType(contractType);
    setFormData({
      code: contractType.code,
      name: contractType.name
    });
    setIsEditDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (contractType: ContractType) => {
    setCurrentContractType(contractType);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAddContractType = () => {
    if (formData.code.trim() === '' || formData.name.trim() === '') return;
    
    addContractType({
      code: formData.code,
      name: formData.name
    });
    
    resetForm();
    setIsAddDialogOpen(false);
  };
  
  const handleUpdateContractType = () => {
    if (!currentContractType) return;
    if (formData.code.trim() === '' || formData.name.trim() === '') return;
    
    updateContractType(currentContractType.id, {
      code: formData.code,
      name: formData.name
    });
    
    resetForm();
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteContractType = () => {
    if (!currentContractType) return;
    
    deleteContractType(currentContractType.id);
    
    resetForm();
    setIsDeleteDialogOpen(false);
  };
  
  const countContractsForType = (typeId: string) => {
    return contracts.filter(contract => contract.contractTypeId === typeId).length;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quản lý loại hợp đồng</h1>
          <p className="text-muted-foreground">Danh sách các loại hợp đồng trong hệ thống</p>
        </div>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm loại hợp đồng
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contractTypes.map((contractType) => (
          <Card key={contractType.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="bg-primary text-primary-foreground pb-2">
              <CardTitle className="flex items-center">
                <FileType className="mr-2 h-5 w-5" />
                {contractType.name}
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Mã: {contractType.code}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Số hợp đồng: {countContractsForType(contractType.id)}
              </p>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleOpenEditDialog(contractType)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Sửa
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleOpenDeleteDialog(contractType)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xoá
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm loại hợp đồng mới</DialogTitle>
            <DialogDescription>
              Điền thông tin loại hợp đồng mới vào form dưới đây
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Mã loại hợp đồng</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Ví dụ: HD-XDTH"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Tên loại hợp đồng</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ví dụ: Hợp đồng xác định thời hạn"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Huỷ</Button>
            <Button onClick={handleAddContractType}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa thông tin loại hợp đồng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin loại hợp đồng
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-code">Mã loại hợp đồng</Label>
              <Input
                id="edit-code"
                name="code"
                value={formData.code}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Tên loại hợp đồng</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Huỷ</Button>
            <Button onClick={handleUpdateContractType}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xoá</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xoá loại hợp đồng này không?
              {currentContractType && countContractsForType(currentContractType.id) > 0 && (
                <p className="text-destructive mt-2">
                  Không thể xoá loại hợp đồng đang có hợp đồng.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Huỷ</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteContractType}
              disabled={currentContractType && countContractsForType(currentContractType.id) > 0}
            >
              Xoá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ContractTypesPage;
