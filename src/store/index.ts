
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createEmployeeSlice } from './slices/employeeSlice';
import { createDepartmentSlice } from './slices/departmentSlice';
import { createPositionSlice } from './slices/positionSlice';
import { createContractSlice } from './slices/contractSlice';
import { createAcademicSlice } from './slices/academicSlice';
import { createRelationshipSlice } from './slices/relationshipSlice';

// Combine all slices into a single store
export const useAppStore = create()(
  devtools(
    persist(
      (...a) => ({
        ...createEmployeeSlice(...a),
        ...createDepartmentSlice(...a),
        ...createPositionSlice(...a),
        ...createContractSlice(...a),
        ...createAcademicSlice(...a),
        ...createRelationshipSlice(...a),
      }),
      {
        name: 'employee-management-storage',
        partialize: (state) => ({
          employees: state.employees,
          departments: state.departments,
          positions: state.positions,
          departmentEmployees: state.departmentEmployees,
          positionEmployees: state.positionEmployees,
          contractTypes: state.contractTypes,
          contracts: state.contracts,
          academicDegrees: state.academicDegrees,
          academicTitles: state.academicTitles,
        }),
        version: 1,
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            return JSON.parse(str);
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          },
        },
      }
    )
  )
);
