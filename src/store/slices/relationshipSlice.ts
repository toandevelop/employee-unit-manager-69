
import { departmentEmployees as initialDepartmentEmployees, positionEmployees as initialPositionEmployees } from '../../data/mockData';
import { DepartmentEmployee, PositionEmployee } from '../../types';

interface RelationshipState {
  departmentEmployees: DepartmentEmployee[];
  positionEmployees: PositionEmployee[];
  
  addDepartmentEmployee: (departmentEmployee: Omit<DepartmentEmployee, 'id'>) => void;
  removeDepartmentEmployee: (employeeId: string, departmentId: string) => void;
  
  addPositionEmployee: (positionEmployee: Omit<PositionEmployee, 'id'>) => void;
  removePositionEmployee: (employeeId: string, positionId: string) => void;
}

export const createRelationshipSlice = (
  set: (fn: (state: any) => any) => void,
  get: () => any
) => ({
  departmentEmployees: initialDepartmentEmployees,
  positionEmployees: initialPositionEmployees,
  
  addDepartmentEmployee: (departmentEmployeeData) => {
    set((state: any) => {
      const newId = (Math.max(...state.departmentEmployees.map(de => parseInt(de.id)), 0) + 1).toString();
      
      const newDepartmentEmployee: DepartmentEmployee = {
        id: newId,
        ...departmentEmployeeData
      };
      
      return {
        departmentEmployees: [...state.departmentEmployees, newDepartmentEmployee]
      };
    });
  },
  
  removeDepartmentEmployee: (employeeId, departmentId) => {
    set((state: any) => {
      return {
        departmentEmployees: state.departmentEmployees.filter(
          de => !(de.employeeId === employeeId && de.departmentId === departmentId)
        )
      };
    });
  },
  
  addPositionEmployee: (positionEmployeeData) => {
    set((state: any) => {
      const newId = (Math.max(...state.positionEmployees.map(pe => parseInt(pe.id)), 0) + 1).toString();
      
      const newPositionEmployee: PositionEmployee = {
        id: newId,
        ...positionEmployeeData
      };
      
      return {
        positionEmployees: [...state.positionEmployees, newPositionEmployee]
      };
    });
  },
  
  removePositionEmployee: (employeeId, positionId) => {
    set((state: any) => {
      return {
        positionEmployees: state.positionEmployees.filter(
          pe => !(pe.employeeId === employeeId && pe.positionId === positionId)
        )
      };
    });
  }
});
