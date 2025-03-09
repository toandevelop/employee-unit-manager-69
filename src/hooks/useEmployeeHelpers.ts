
import { useAppStore } from '@/store';
import { Employee } from '@/types';

export const useEmployeeHelpers = () => {
  const { 
    departments, 
    positions,
    departmentEmployees,
    positionEmployees,
    academicDegrees,
    academicTitles
  } = useAppStore();

  // Helper function to get departments for an employee
  const getEmployeeDepartments = (employeeId: string) => {
    const departmentIds = departmentEmployees
      .filter(de => de.employeeId === employeeId)
      .map(de => de.departmentId);
    
    return departments.filter(dept => departmentIds.includes(dept.id));
  };
  
  // Helper function to get positions for an employee
  const getEmployeePositions = (employeeId: string) => {
    const positionIds = positionEmployees
      .filter(pe => pe.employeeId === employeeId)
      .map(pe => pe.positionId);
    
    return positions.filter(pos => positionIds.includes(pos.id));
  };
  
  // Helper function to get academic degree name by id
  const getAcademicDegreeName = (id?: string) => {
    if (!id) return null;
    const degree = academicDegrees.find(d => d.id === id);
    return degree ? `${degree.shortName} (${degree.name})` : null;
  };
  
  // Helper function to get academic title name by id
  const getAcademicTitleName = (id?: string) => {
    if (!id) return null;
    const title = academicTitles.find(t => t.id === id);
    return title ? `${title.shortName} (${title.name})` : null;
  };

  return {
    getEmployeeDepartments,
    getEmployeePositions,
    getAcademicDegreeName,
    getAcademicTitleName
  };
};
