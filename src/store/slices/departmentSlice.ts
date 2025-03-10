
import { create } from 'zustand';
import { departments as initialDepartments } from '../../data/mockData';
import { Department } from '../../types';
import { toast } from 'sonner';

interface DepartmentState {
  departments: Department[];
  
  addDepartment: (department: Omit<Department, 'id' | 'departmentEmployees'>) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
}

export const createDepartmentSlice = (
  set: (fn: (state: any) => any) => void,
  get: () => any
) => ({
  departments: initialDepartments,
  
  addDepartment: (departmentData) => {
    set((state: any) => {
      const newId = (Math.max(...state.departments.map(d => parseInt(d.id))) + 1).toString();
      
      const newDepartment: Department = {
        id: newId,
        ...departmentData,
        departmentEmployees: []
      };
      
      toast.success("Thêm đơn vị thành công");
      
      return {
        departments: [...state.departments, newDepartment]
      };
    });
  },
  
  updateDepartment: (id, departmentData) => {
    set((state: any) => {
      // Process headId - convert "none" to undefined
      if (departmentData.headId === "none") {
        departmentData.headId = undefined;
      }
      
      const updatedDepartments = state.departments.map(dept => 
        dept.id === id ? { ...dept, ...departmentData } : dept
      );
      
      toast.success("Cập nhật thông tin đơn vị thành công");
      
      return {
        departments: updatedDepartments
      };
    });
  },
  
  deleteDepartment: (id) => {
    set((state: any) => {
      const hasEmployees = state.departmentEmployees.some(de => de.departmentId === id);
      
      if (hasEmployees) {
        toast.error("Không thể xoá đơn vị đang có nhân viên");
        return state;
      }
      
      toast.success("Xoá đơn vị thành công");
      
      return {
        departments: state.departments.filter(dept => dept.id !== id),
        departmentEmployees: state.departmentEmployees.filter(de => de.departmentId !== id)
      };
    });
  },
});
