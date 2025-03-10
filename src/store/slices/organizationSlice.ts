
import { Organization, Department } from '@/types';
import { toast } from 'sonner';

// Initial data for Nam Can Tho University
const initialOrganizations: Organization[] = [
  {
    id: "1",
    code: "NCTU",
    name: "Trường đại học Nam Cần Thơ",
    foundingDate: "2013-05-20",
    description: "Trường đại học tư thục tại Cần Thơ",
    departments: []
  }
];

export const createOrganizationSlice = (
  set: (fn: (state: any) => any) => void,
  get: () => any
) => ({
  organizations: initialOrganizations,
  
  // Add a new organization
  addOrganization: (organization: Omit<Organization, 'id' | 'departments'>) => {
    set((state: any) => {
      const newId = state.organizations.length > 0 
        ? (Math.max(...state.organizations.map((o: Organization) => Number(o.id))) + 1).toString()
        : "1";
      
      const newOrganization: Organization = {
        id: newId,
        ...organization,
        departments: []
      };
      
      toast.success("Thêm tổ chức thành công");
      
      return {
        organizations: [...state.organizations, newOrganization]
      };
    });
  },
  
  // Update an existing organization
  updateOrganization: (id: string, organizationData: Partial<Organization>) => {
    set((state: any) => {
      const updatedOrganizations = state.organizations.map((org: Organization) => 
        org.id === id ? { ...org, ...organizationData } : org
      );
      
      toast.success("Cập nhật thông tin tổ chức thành công");
      
      return {
        organizations: updatedOrganizations
      };
    });
  },
  
  // Delete an organization if it has no departments
  deleteOrganization: (id: string) => {
    set((state: any) => {
      const organization = state.organizations.find((org: Organization) => org.id === id);
      
      if (organization && organization.departments.length > 0) {
        toast.error("Không thể xoá tổ chức đang có phòng ban");
        return state;
      }
      
      toast.success("Xoá tổ chức thành công");
      
      return {
        organizations: state.organizations.filter((org: Organization) => org.id !== id)
      };
    });
  },
  
  // Add a department to an organization
  addDepartmentToOrganization: (organizationId: string, departmentId: string) => {
    set((state: any) => {
      const department = state.departments.find((d: Department) => d.id === departmentId);
      
      if (!department) {
        toast.error("Không tìm thấy phòng ban");
        return state;
      }
      
      const updatedOrganizations = state.organizations.map((org: Organization) => {
        if (org.id === organizationId) {
          return {
            ...org,
            departments: [...org.departments, department]
          };
        }
        return org;
      });
      
      toast.success("Thêm phòng ban vào tổ chức thành công");
      
      return {
        organizations: updatedOrganizations
      };
    });
  },
  
  // Remove a department from an organization
  removeDepartmentFromOrganization: (organizationId: string, departmentId: string) => {
    set((state: any) => {
      const updatedOrganizations = state.organizations.map((org: Organization) => {
        if (org.id === organizationId) {
          return {
            ...org,
            departments: org.departments.filter((d: Department) => d.id !== departmentId)
          };
        }
        return org;
      });
      
      toast.success("Xoá phòng ban khỏi tổ chức thành công");
      
      return {
        organizations: updatedOrganizations
      };
    });
  }
});
