
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
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useAppStore } from '@/store';
import { Contract } from '@/types';
import { FileText, Plus, Pencil, Trash2, Search, Edit } from 'lucide-react';

const ContractsPage = () => {
  const { contracts, employees, contractTypes, deleteContract } = useAppStore();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentContract, setCurrentContract] = useState<Contract | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
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
  
  const handleOpenDeleteDialog = (contract: Contract) => {
    setCurrentContract(contract);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteContract = () => {
    if (!currentContract) return;
    
    deleteContract(currentContract.id);
    
    setCurrentContract(null);
    setIsDeleteDialogOpen(false);
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
                  asChild
                >
                  <Link to={`/contracts/edit/${contract.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
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
