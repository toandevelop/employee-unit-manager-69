
import React, { useState, useRef } from 'react';
import { useAppStore } from '@/store';
import { motion } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Check, Printer, Search, User, Download } from 'lucide-react';
import { useEmployeeHelpers } from '@/hooks/useEmployeeHelpers';
import { Employee } from '@/types';
import EmployeeCardTemplate from '@/components/employee/EmployeeCardTemplate';
import PrintableCard from '@/components/employee/PrintableCard';
import { toast } from 'sonner';

const EmployeeCardPage: React.FC = () => {
  const { employees, departments } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        employee.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || 
                            employee.departmentEmployees.some(de => de.departmentId === selectedDepartment);
    
    return matchesSearch && matchesDepartment;
  });

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Employee-Cards',
    onAfterPrint: () => toast.success('In thẻ nhân viên thành công'),
  });

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">In thẻ nhân viên</h1>
          <p className="text-muted-foreground mt-1">
            Tạo và in thẻ nhân viên với đầy đủ thông tin
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleSelectAll}
            disabled={filteredEmployees.length === 0}
          >
            {selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0 ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </Button>
          
          <Button 
            onClick={handlePrint}
            disabled={selectedEmployees.length === 0}
          >
            <Printer className="mr-2 h-4 w-4" />
            In {selectedEmployees.length} thẻ
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>Tìm kiếm nhân viên để in thẻ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, mã nhân viên..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Phòng ban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phòng ban</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map(employee => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            isSelected={selectedEmployees.includes(employee.id)}
            onToggleSelect={() => toggleEmployeeSelection(employee.id)}
          />
        ))}
        
        {filteredEmployees.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">Không tìm thấy nhân viên</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thử tìm kiếm với từ khóa khác hoặc chọn phòng ban khác
            </p>
          </div>
        )}
      </div>
      
      {/* Print Container - Hidden except when printing */}
      <div className="hidden">
        <div ref={printRef} className="p-4 grid grid-cols-1 gap-5">
          {selectedEmployees.map(id => {
            const employee = employees.find(emp => emp.id === id);
            if (!employee) return null;
            return <PrintableCard key={id} employee={employee} />;
          })}
        </div>
      </div>
    </div>
  );
};

// Employee Card component
interface EmployeeCardProps {
  employee: Employee;
  isSelected: boolean;
  onToggleSelect: () => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, isSelected, onToggleSelect }) => {
  const { getEmployeeDepartments, getEmployeePositions } = useEmployeeHelpers();
  const departments = getEmployeeDepartments(employee.id);
  const positions = getEmployeePositions(employee.id);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <Card className={`overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
        <CardContent className="p-0 relative">
          <Button
            size="icon"
            variant={isSelected ? "default" : "outline"}
            className="absolute right-2 top-2 z-10"
            onClick={onToggleSelect}
          >
            {isSelected && <Check className="h-4 w-4" />}
          </Button>
          
          <Tabs defaultValue="preview">
            <TabsList className="w-full rounded-none">
              <TabsTrigger value="preview" className="flex-1">Xem trước</TabsTrigger>
              <TabsTrigger value="info" className="flex-1">Thông tin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="p-0 m-0 flex justify-center">
              <EmployeeCardTemplate employee={employee} />
            </TabsContent>
            
            <TabsContent value="info" className="p-4 m-0">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">Mã NV: {employee.code}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="font-medium">Phòng ban</div>
                    <div className="mt-1 space-y-1">
                      {departments.map(dept => (
                        <Badge key={dept.id} variant="outline" className="mr-1">
                          {dept.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium">Chức vụ</div>
                    <div className="mt-1 space-y-1">
                      {positions.map(pos => (
                        <Badge key={pos.id} variant="secondary" className="mr-1">
                          {pos.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={onToggleSelect}
                  >
                    {isSelected ? 'Bỏ chọn' : 'Chọn'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmployeeCardPage;
