
import { motion } from 'framer-motion';
import { Employee } from '@/types';
import EmployeeCard from './EmployeeCard';
import { useEmployeeHelpers } from '@/hooks/useEmployeeHelpers';

interface EmployeeListProps {
  employees: Employee[];
  onEditClick: (employee: Employee) => void;
  onDeleteClick: (id: string) => void;
}

const EmployeeList = ({ employees, onEditClick, onDeleteClick }: EmployeeListProps) => {
  const { 
    getEmployeeDepartments, 
    getEmployeePositions,
    getAcademicDegreeName,
    getAcademicTitleName
  } = useEmployeeHelpers();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {employees.length > 0 ? employees.map((employee) => {
        const employeeDepartments = getEmployeeDepartments(employee.id);
        const employeePositions = getEmployeePositions(employee.id);
        const academicDegree = getAcademicDegreeName(employee.academicDegreeId);
        const academicTitle = getAcademicTitleName(employee.academicTitleId);
        
        return (
          <EmployeeCard 
            key={employee.id}
            employee={employee}
            employeeDepartments={employeeDepartments}
            employeePositions={employeePositions}
            academicDegree={academicDegree}
            academicTitle={academicTitle}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        );
      }) : (
        <div className="col-span-3 flex justify-center py-12">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Không tìm thấy nhân viên nào</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EmployeeList;
