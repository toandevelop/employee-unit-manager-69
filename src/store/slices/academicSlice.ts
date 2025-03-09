
import { create } from 'zustand';
import { academicDegrees as initialAcademicDegrees, academicTitles as initialAcademicTitles } from '../../data/academicData';
import { AcademicDegree, AcademicTitle } from '../../types';
import { toast } from 'sonner';

interface AcademicState {
  academicDegrees: AcademicDegree[];
  academicTitles: AcademicTitle[];
  
  addAcademicDegree: (academicDegree: Omit<AcademicDegree, 'id' | 'employees'>) => void;
  updateAcademicDegree: (id: string, academicDegree: Partial<AcademicDegree>) => void;
  deleteAcademicDegree: (id: string) => void;
  
  addAcademicTitle: (academicTitle: Omit<AcademicTitle, 'id' | 'employees'>) => void;
  updateAcademicTitle: (id: string, academicTitle: Partial<AcademicTitle>) => void;
  deleteAcademicTitle: (id: string) => void;
}

export const createAcademicSlice = (
  set: (fn: (state: any) => any) => void,
  get: () => any
) => ({
  academicDegrees: initialAcademicDegrees,
  academicTitles: initialAcademicTitles,
  
  addAcademicDegree: (academicDegreeData) => {
    set((state: any) => {
      const newId = (Math.max(...state.academicDegrees.map(ad => parseInt(ad.id) || 0), 0) + 1).toString();
      
      const newAcademicDegree: AcademicDegree = {
        id: newId,
        ...academicDegreeData,
      };
      
      toast.success("Thêm học vị thành công");
      
      return {
        academicDegrees: [...state.academicDegrees, newAcademicDegree]
      };
    });
  },
  
  updateAcademicDegree: (id, academicDegreeData) => {
    set((state: any) => {
      const updatedAcademicDegrees = state.academicDegrees.map(ad => 
        ad.id === id ? { ...ad, ...academicDegreeData } : ad
      );
      
      toast.success("Cập nhật học vị thành công");
      
      return {
        academicDegrees: updatedAcademicDegrees
      };
    });
  },
  
  deleteAcademicDegree: (id) => {
    set((state: any) => {
      // Check if any employee is using this academic degree
      const hasEmployees = state.employees && state.employees.some(emp => emp.academicDegreeId === id);
      
      if (hasEmployees) {
        toast.error("Không thể xoá học vị đang có nhân viên");
        return state;
      }
      
      toast.success("Xoá học vị thành công");
      
      return {
        academicDegrees: state.academicDegrees.filter(ad => ad.id !== id)
      };
    });
  },
  
  addAcademicTitle: (academicTitleData) => {
    set((state: any) => {
      const newId = (Math.max(...state.academicTitles.map(at => parseInt(at.id) || 0), 0) + 1).toString();
      
      const newAcademicTitle: AcademicTitle = {
        id: newId,
        ...academicTitleData,
      };
      
      toast.success("Thêm học hàm thành công");
      
      return {
        academicTitles: [...state.academicTitles, newAcademicTitle]
      };
    });
  },
  
  updateAcademicTitle: (id, academicTitleData) => {
    set((state: any) => {
      const updatedAcademicTitles = state.academicTitles.map(at => 
        at.id === id ? { ...at, ...academicTitleData } : at
      );
      
      toast.success("Cập nhật học hàm thành công");
      
      return {
        academicTitles: updatedAcademicTitles
      };
    });
  },
  
  deleteAcademicTitle: (id) => {
    set((state: any) => {
      // Check if any employee is using this academic title
      const hasEmployees = state.employees && state.employees.some(emp => emp.academicTitleId === id);
      
      if (hasEmployees) {
        toast.error("Không thể xoá học hàm đang có nhân viên");
        return state;
      }
      
      toast.success("Xoá học hàm thành công");
      
      return {
        academicTitles: state.academicTitles.filter(at => at.id !== id)
      };
    });
  },
});
