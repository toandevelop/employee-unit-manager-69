import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useAppStore } from '@/store';
import { Contract, Employee } from '@/types';
import { FileText, Plus, Pencil, Trash2, Search } from 'lucide-react';

const ContractsPage = () => {
  const { contracts, employees, contractTypes, updateContract, deleteContract } = useAppStore();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentContract, setCurrentContract] = useState<Contract | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    code: '',
    employeeId: '',
    contractTypeId: '',
    startDate: '',
    endDate: '',
    baseSalary: 0,
    allowance: 0
  });
  
  const resetForm = () => {
    setFormData({
      code: '',
      employeeId: '',
      contractTypeId: '',
      startDate: '',
      endDate: '',
      baseSalary: 0,
      allowance: 0
    });
    setCurrentContract(null);
  };
  
  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const employee = employees.find(e => e.id === contract.employeeId);
      const contractType = contractTypes.find(ct => ct.id === contract.contractTypeId);
      
      if (!employee || !contractType) return false;
      
      const searchLower = searchTerm.toLowerCase();
      return contract.code.toLowerCase().includes(searchLower) ||
             employee.name.toLowerCase().includes(searchLower) ||
             contractType.name.toLowerCase().includes(searchLower);
    });
  }, [contracts, employees, contractTypes, searchTerm]);
  
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : 'N/A';
  };
  
  const getContractTypeName = (contractTypeId: string) => {
    const contractType = contractTypes.find(ct => ct.id === contractTypeId);
    return contractType ? contractType.name : 'N/A';
  };
  
  const calculateTotalSalary = (baseSalary: number, allowance: number) => {
    return baseSalary + allowance;
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  
  const handleOpenEditDialog = (contract: Contract) => {
    setCurrentContract(contract);
    setFormData({
      code: contract.code,
      employeeId: contract.employeeId,
      contractTypeId: contract.contractTypeId,
      startDate: contract.startDate,
      endDate: contract.endDate,
      baseSalary: contract.baseSalary,
      allowance: contract.allowance
    });
    setIsEditDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (contract: Contract) => {
    setCurrentContract(contract);
    setIsDeleteDialogOpen(true);
  };
  
  const handleUpdateContract = () => {
    if (!currentContract) return;
    if (
      formData.code.trim() === '' ||
      formData.employeeId === '' ||
      formData.contractTypeId === '' ||
      formData.startDate === ''
    ) return;
    
    updateContract(currentContract.id, {
      code: formData.code,
      employeeId: formData.employeeId,
      contractTypeId: formData.contractTypeId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      baseSalary: Number(formData.baseSalary),
      allowance: Number(formData.allowance)
    });
    
    resetForm();
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteContract = () => {
    if (!currentContract) return;
    
    deleteContract(currentContract.id);
    
    resetForm();
    setIsDeleteDialogOpen(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'baseSalary' || name === 'allowance') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
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
          <h1 className="text-3xl font-bold">Quản lý hợp đồng</h1>
          <p className="text-muted-foreground">Danh sách các hợp đồng trong hệ thống</p>
        </div>
        <Button asChild>
          <Link to="/contracts/add">
            <Plus className="mr-2 h-4 w-4" />
            Thêm hợp đồng
          </Link>
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm hợp đồng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid gap-6">
        {filteredContracts.map((contract) => (
          <Card key={contract.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between bg-primary text-primary-foreground pb-2">
              <div>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Hợp đồng: {contract.code}
                </CardTitle>
                <p className="text-primary-foreground/80 text-sm">
                  Nhân viên: {getEmployeeName(contract.employeeId)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleOpenEditDialog(contract)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleOpenDeleteDialog(contract)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Loại hợp đồng</p>
                  <p>{getContractTypeName(contract.contractTypeId)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Thời gian</p>
                  <p>Từ: {contract.startDate}</p>
                  {contract.endDate && <p>Đến: {contract.endDate}</p>}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Lương cơ bản</p>
                  <p>{formatCurrency(contract.baseSalary)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tổng lương</p>
                  <p className="font-semibold text-primary">
                    {formatCurrency(calculateTotalSalary(contract.baseSalary, contract.allowance))}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    (Phụ cấp: {formatCurrency(contract.allowance)})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredContracts.length === 0 && (
          <div className="text-center py-10">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <p className="mt-4 text-lg text-muted-foreground">Không tìm thấy hợp đồng nào</p>
          </div>
        )}
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sửa thông tin hợp đồng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin hợp đồng
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-code">Mã hợp đồng</Label>
                <Input
                  id="edit-code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-employeeId">Nhân viên</Label>
                <Select 
                  value={formData.employeeId}
                  onValueChange={(value) => handleSelectChange('employeeId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhân viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.code} - {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-contractTypeId">Loại hợp đồng</Label>
                <Select 
                  value={formData.contractTypeId}
                  onValueChange={(value) => handleSelectChange('contractTypeId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại hợp đồng" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTypes.map((contractType) => (
                      <SelectItem key={contractType.id} value={contractType.id}>
                        {contractType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-startDate">Ngày bắt đầu</Label>
                <Input
                  id="edit-startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-endDate">Ngày kết thúc</Label>
                <Input
                  id="edit-endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-baseSalary">Lương cơ bản (VNĐ)</Label>
                <Input
                  id="edit-baseSalary"
                  name="baseSalary"
                  type="number"
                  value={formData.baseSalary || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-allowance">Phụ cấp (VNĐ)</Label>
                <Input
                  id="edit-allowance"
                  name="allowance"
                  type="number"
                  value={formData.allowance || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="mt-2">
              <Label>Tổng lương:</Label>
              <p className="text-lg font-semibold text-primary">
                {formatCurrency(calculateTotalSalary(Number(formData.baseSalary), Number(formData.allowance)))}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Huỷ</Button>
            <Button onClick={handleUpdateContract}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xoá</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xoá hợp đồng này không?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Huỷ</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteContract}
            >
              Xoá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ContractsPage;
