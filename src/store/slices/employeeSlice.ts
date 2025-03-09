
import { create } from 'zustand';
import { employees as initialEmployees } from '../../data/mockData';
import { Employee } from '../../types';
import { toast } from 'sonner';

interface EmployeeState {
  employees: Employee[];
  
  addEmployee: (employee: Omit<Employee, 'id' | 'departmentEmployees' | 'positionEmployees'> & { 
    departmentIds: string[],
    positionIds: string[] 
  }) => void;
  updateEmployee: (id: string, employee: Partial<Employee> & { 
    departmentIds?: string[],
    positionIds?: string[] 
  }) => void;
  deleteEmployee: (id: string) => void;
}

export const createEmployeeSlice = (
  set: (fn: (state: any) => any) => void,
  get: () => any
) => ({
  employees: initialEmployees,
  
  addEmployee: (employeeData) => {
    set((state: any) => {
      // Generate a new ID for the employee
      const newId = (Math.max(0, ...state.employees.map(e => parseInt(e.id))) + 1).toString();
      
      const { departmentIds, positionIds, ...employeeFields } = employeeData;
      
      const newEmployee: Employee = {
        id: newId,
        ...employeeFields,
        departmentEmployees: [],
        positionEmployees: []
      };
      
      // Create department-employee relationships
      const newDepartmentEmployees = departmentIds.map((deptId, index) => {
        const maxId = state.departmentEmployees.length > 0 
          ? Math.max(...state.departmentEmployees.map(de => parseInt(de.id)))
          : 0;
        const newDepartmentEmployeeId = (maxId + index + 1).toString();
        return {
          id: newDepartmentEmployeeId,
          employeeId: newId,
          departmentId: deptId
        };
      });
      
      // Create position-employee relationships
      const newPositionEmployees = positionIds.map((posId, index) => {
        const maxId = state.positionEmployees.length > 0
          ? Math.max(...state.positionEmployees.map(pe => parseInt(pe.id)))
          : 0;
        const newPositionEmployeeId = (maxId + index + 1).toString();
        return {
          id: newPositionEmployeeId,
          employeeId: newId,
          positionId: posId
        };
      });
      
      toast.success("Thêm nhân viên thành công");
      
      return {
        employees: [...state.employees, newEmployee],
        departmentEmployees: [...state.departmentEmployees, ...newDepartmentEmployees],
        positionEmployees: [...state.positionEmployees, ...newPositionEmployees],
      };
    });
  },
  
  updateEmployee: (id, employeeData) => {
    set((state: any) => {
      const { departmentIds, positionIds, ...employeeFields } = employeeData;
      
      // Update employee data
      const updatedEmployees = state.employees.map(emp => 
        emp.id === id ? { ...emp, ...employeeFields } : emp
      );
      
      let updatedDepartmentEmployees = [...state.departmentEmployees];
      let updatedPositionEmployees = [...state.positionEmployees];
      
      // Update department relationships if provided
      if (departmentIds) {
        // Remove existing relationships
        updatedDepartmentEmployees = updatedDepartmentEmployees.filter(de => de.employeeId !== id);
        
        // Create new relationships
        const newDepartmentEmployees = departmentIds.map((deptId, index) => {
          const maxId = Math.max(0, ...state.departmentEmployees.map(de => parseInt(de.id)));
          const newId = (maxId + index + 1).toString();
          return {
            id: newId,
            employeeId: id,
            departmentId: deptId
          };
        });
        
        updatedDepartmentEmployees = [...updatedDepartmentEmployees, ...newDepartmentEmployees];
      }
      
      // Update position relationships if provided
      if (positionIds) {
        // Remove existing relationships
        updatedPositionEmployees = updatedPositionEmployees.filter(pe => pe.employeeId !== id);
        
        // Create new relationships
        const newPositionEmployees = positionIds.map((posId, index) => {
          const maxId = Math.max(0, ...state.positionEmployees.map(pe => parseInt(pe.id)));
          const newId = (maxId + index + 1).toString();
          return {
            id: newId,
            employeeId: id,
            positionId: posId
          };
        });
        
        updatedPositionEmployees = [...updatedPositionEmployees, ...newPositionEmployees];
      }
      
      toast.success("Cập nhật thông tin nhân viên thành công");
      
      return {
        employees: updatedEmployees,
        departmentEmployees: updatedDepartmentEmployees,
        positionEmployees: updatedPositionEmployees
      };
    });
  },
  
  deleteEmployee: (id) => {
    set((state: any) => {
      toast.success("Xoá nhân viên thành công");
      
      return {
        employees: state.employees.filter(emp => emp.id !== id),
        departmentEmployees: state.departmentEmployees.filter(de => de.employeeId !== id),
        positionEmployees: state.positionEmployees.filter(pe => pe.employeeId !== id)
      };
    });
  },
});
