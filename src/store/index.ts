
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createEmployeeSlice } from './slices/employeeSlice';
import { createDepartmentSlice } from './slices/departmentSlice';
import { createPositionSlice } from './slices/positionSlice';
import { createContractSlice } from './slices/contractSlice';
import { createAcademicSlice } from './slices/academicSlice';
import { createRelationshipSlice } from './slices/relationshipSlice';
import { createWorkReportSlice } from './slices/workReportSlice';
import { createLeaveSlice } from './slices/leaveSlice';
import { createOvertimeSlice } from './slices/overtimeSlice';
import { createWorkShiftSlice } from './slices/workShiftSlice';
import { createTimeEntrySlice } from './slices/timeEntrySlice';
import { createTimekeepingDeviceSlice } from './slices/timekeepingDeviceSlice';

// Define the store type to include all slice properties
type StoreState = ReturnType<typeof createEmployeeSlice> &
  ReturnType<typeof createDepartmentSlice> &
  ReturnType<typeof createPositionSlice> &
  ReturnType<typeof createContractSlice> &
  ReturnType<typeof createAcademicSlice> &
  ReturnType<typeof createRelationshipSlice> &
  ReturnType<typeof createWorkReportSlice> &
  ReturnType<typeof createLeaveSlice> &
  ReturnType<typeof createOvertimeSlice> &
  ReturnType<typeof createWorkShiftSlice> &
  ReturnType<typeof createTimeEntrySlice> &
  ReturnType<typeof createTimekeepingDeviceSlice>;

// Combine all slices into a single store
export const useAppStore = create<StoreState>()(
  devtools(
    persist(
      (set, get, api) => ({
        ...createEmployeeSlice(set, get),
        ...createDepartmentSlice(set, get),
        ...createPositionSlice(set, get),
        ...createContractSlice(set, get),
        ...createAcademicSlice(set, get),
        ...createRelationshipSlice(set, get),
        ...createWorkReportSlice(set, get),
        ...createLeaveSlice(set, get),
        ...createOvertimeSlice(set, get),
        ...createWorkShiftSlice(set, get, api),
        ...createTimeEntrySlice(set, get, api),
        ...createTimekeepingDeviceSlice(set, get, api),
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
          workReports: state.workReports,
          leaveTypes: state.leaveTypes,
          leaves: state.leaves,
          overtimeTypes: state.overtimeTypes,
          overtimes: state.overtimes,
          workShifts: state.workShifts,
          timeEntries: state.timeEntries,
          timekeepingDevices: state.timekeepingDevices,
          rawTimeData: state.rawTimeData,
        }),
      }
    )
  )
);
