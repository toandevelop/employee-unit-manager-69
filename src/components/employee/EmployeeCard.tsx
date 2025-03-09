
import { motion } from 'framer-motion';
import { 
  User, 
  Building2, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Pencil, 
  Trash2, 
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Department, Employee, Position } from '@/types';

interface EmployeeCardProps {
  employee: Employee;
  employeeDepartments: Department[];
  employeePositions: Position[];
  academicDegree: string;
  academicTitle: string;
  onEditClick: (employee: Employee) => void;
  onDeleteClick: (id: string) => void;
}

const EmployeeCard = ({ 
  employee, 
  employeeDepartments, 
  employeePositions, 
  academicDegree, 
  academicTitle,
  onEditClick,
  onDeleteClick
}: EmployeeCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div variants={cardVariants}>
      <Card className="overflow-hidden hover:shadow-md transition-all-300">
        <CardHeader className="bg-primary/5 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-bold">{employee.name}</CardTitle>
              <CardDescription className="mt-1">
                {employee.code}
              </CardDescription>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-primary"
                onClick={() => onEditClick(employee)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa nhân viên</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa nhân viên "{employee.name}"? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => onDeleteClick(employee.id)}
                    >
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">Chức vụ:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {employeePositions.length > 0 ? (
                    employeePositions.map(position => (
                      <Badge key={position.id} variant="secondary">
                        {position.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">Chưa cập nhật</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">Đơn vị:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {employeeDepartments.length > 0 ? (
                    employeeDepartments.map(department => (
                      <Badge key={department.id} variant="outline">
                        {department.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">Chưa cập nhật</span>
                  )}
                </div>
              </div>
            </div>
            
            {(academicDegree || academicTitle) && (
              <div className="space-y-2">
                {academicDegree && (
                  <div className="flex items-center gap-3 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span><span className="font-medium">Học vị:</span> {academicDegree}</span>
                  </div>
                )}
                
                {academicTitle && (
                  <div className="flex items-center gap-3 text-sm">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span><span className="font-medium">Học hàm:</span> {academicTitle}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{employee.address}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{employee.phone}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>CCCD: {employee.identityCard}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Ngày ký HĐ: {new Date(employee.contractDate).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmployeeCard;
