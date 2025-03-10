
import { create } from 'zustand';
import { Department } from '../../types';
import { toast } from 'sonner';

// Initial data for departments in Nam Can Tho University
const initialDepartments: Department[] = [
  {
    id: "1",
    code: "CNTT",
    name: "Phòng Công nghệ thông tin",
    foundingDate: "2013-06-15",
    organizationId: "1", // ID of Nam Can Tho University
    departmentEmployees: []
  },
  {
    id: "2",
    code: "NS",
    name: "Phòng Nhân sự",
    foundingDate: "2013-06-15",
    organizationId: "1", // ID of Nam Can Tho University
    departmentEmployees: []
  },
  {
    id: "3",
    code: "KT",
    name: "Phòng Kế toán",
    foundingDate: "2013-06-15",
    organizationId: "1", // ID of Nam Can Tho University
    departmentEmployees: []
  },
  {
    id: "4",
    code: "MKT",
    name: "Phòng Marketing",
    foundingDate: "2013-06-15",
    organizationId: "1", // ID of Nam Can Tho University
    departmentEmployees: []
  }
];

export const createDepartmentSlice = (
  set: (fn: (state: any) => any) => void,
  get: () => any
) => ({
  departments: initialDepartments,
  
  addDepartment: (departmentData: Omit<Department, 'id' | 'departmentEmployees'>) => {
    set((state: any) => {
      const newId = (Math.max(...state.departments.map((d: Department) => parseInt(d.id))) + 1).toString();
      
      const newDepartment: Department = {
        id: newId,
        ...departmentData,
        departmentEmployees: []
      };
      
      // Also update the organization's departments list
      const updatedOrganizations = state.organizations.map((org: any) => {
        if (org.id === departmentData.organizationId) {
          return {
            ...org,
            departments: [...org.departments, newDepartment]
          };
        }
        return org;
      });
      
      toast.success("Thêm phòng ban thành công");
      
      return {
        departments: [...state.departments, newDepartment],
        organizations: updatedOrganizations
      };
    });
  },
  
  updateDepartment: (id: string, departmentData: Partial<Department>) => {
    set((state: any) => {
      // Process headId - convert "none" to undefined
      if (departmentData.headId === "none") {
        departmentData.headId = undefined;
      }
      
      const oldDepartment = state.departments.find((d: Department) => d.id === id);
      const updatedDepartment = { ...oldDepartment, ...departmentData };
      
      const updatedDepartments = state.departments.map((dept: Department) => 
        dept.id === id ? updatedDepartment : dept
      );
      
      // If organizationId changed, update both organizations
      let updatedOrganizations = state.organizations;
      if (departmentData.organizationId && oldDepartment.organizationId !== departmentData.organizationId) {
        updatedOrganizations = state.organizations.map((org: any) => {
          // Remove from old organization
          if (org.id === oldDepartment.organizationId) {
            return {
              ...org,
              departments: org.departments.filter((d: Department) => d.id !== id)
            };
          }
          // Add to new organization
          if (org.id === departmentData.organizationId) {
            return {
              ...org,
              departments: [...org.departments, updatedDepartment]
            };
          }
          return org;
        });
      } else if (departmentData.name || departmentData.code || departmentData.foundingDate || departmentData.headId) {
        // Just update the department in the current organization
        updatedOrganizations = state.organizations.map((org: any) => {
          if (org.id === oldDepartment.organizationId) {
            return {
              ...org,
              departments: org.departments.map((d: Department) => 
                d.id === id ? updatedDepartment : d
              )
            };
          }
          return org;
        });
      }
      
      toast.success("Cập nhật thông tin phòng ban thành công");
      
      return {
        departments: updatedDepartments,
        organizations: updatedOrganizations
      };
    });
  },
  
  deleteDepartment: (id: string) => {
    set((state: any) => {
      const hasEmployees = state.departmentEmployees.some((de: any) => de.departmentId === id);
      
      if (hasEmployees) {
        toast.error("Không thể xoá phòng ban đang có nhân viên");
        return state;
      }
      
      const departmentToDelete = state.departments.find((d: Department) => d.id === id);
      
      // Also remove the department from its organization
      const updatedOrganizations = state.organizations.map((org: any) => {
        if (org.id === departmentToDelete.organizationId) {
          return {
            ...org,
            departments: org.departments.filter((d: Department) => d.id !== id)
          };
        }
        return org;
      });
      
      toast.success("Xoá phòng ban thành công");
      
      return {
        departments: state.departments.filter((dept: Department) => dept.id !== id),
        departmentEmployees: state.departmentEmployees.filter((de: any) => de.departmentId !== id),
        organizations: updatedOrganizations
      };
    });
  },
});
