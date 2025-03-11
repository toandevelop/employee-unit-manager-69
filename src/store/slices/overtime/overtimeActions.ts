
import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { Overtime } from '@/types';
import { calculateHoursFromTimes } from '@/utils/overtimeCalculations';

export interface OvertimeState {
  overtimes: Overtime[];
}

export interface OvertimeActions {
  addOvertime: (overtime: Omit<Overtime, 'id' | 'hours' | 'status' | 'createdAt'> & { startTime: string; endTime: string }) => void;
  updateOvertime: (id: string, overtime: Partial<Overtime>) => void;
  deleteOvertime: (id: string) => void;
  departmentApproveOvertime: (id: string, approverEmployeeId: string) => void;
  approveOvertime: (id: string, approverEmployeeId: string) => void;
  rejectOvertime: (id: string, rejecterEmployeeId: string, reason: string) => void;
}

export type OvertimeSlice = OvertimeState & OvertimeActions;

export const createOvertimeActions = <T extends OvertimeState>(
  set: (fn: (state: T) => Partial<T>) => void
): OvertimeActions => ({
  addOvertime: (overtime) => {
    // Calculate hours from start and end time
    const hours = calculateHoursFromTimes(overtime.startTime, overtime.endTime);
    
    set((state) => ({
      overtimes: [
        ...state.overtimes,
        {
          ...overtime,
          id: uuidv4(),
          hours,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ]
    }));
  },
  
  updateOvertime: (id, overtime) => {
    set((state) => ({
      overtimes: state.overtimes.map((ot) => {
        if (ot.id === id) {
          // Calculate hours if both startTime and endTime are provided
          let hours = ot.hours;
          if (overtime.startTime && overtime.endTime) {
            hours = calculateHoursFromTimes(overtime.startTime, overtime.endTime);
          }
          
          return { 
            ...ot, 
            ...overtime,
            hours: overtime.startTime && overtime.endTime ? hours : ot.hours
          };
        }
        return ot;
      })
    }));
  },
  
  deleteOvertime: (id) => {
    set((state) => ({
      overtimes: state.overtimes.filter((ot) => ot.id !== id)
    }));
  },
  
  departmentApproveOvertime: (id, approverEmployeeId) => {
    set((state) => ({
      overtimes: state.overtimes.map((ot) => 
        ot.id === id 
          ? { 
              ...ot, 
              status: 'department_approved',
              departmentApprovedById: approverEmployeeId,
              departmentApprovedDate: format(new Date(), 'yyyy-MM-dd')
            } 
          : ot
      )
    }));
  },
  
  approveOvertime: (id, approverEmployeeId) => {
    set((state) => ({
      overtimes: state.overtimes.map((ot) => 
        ot.id === id 
          ? { 
              ...ot, 
              status: 'approved',
              approvedById: approverEmployeeId,
              approvedDate: format(new Date(), 'yyyy-MM-dd')
            } 
          : ot
      )
    }));
  },
  
  rejectOvertime: (id, rejecterEmployeeId, reason) => {
    set((state) => ({
      overtimes: state.overtimes.map((ot) => 
        ot.id === id 
          ? { 
              ...ot, 
              status: 'rejected',
              rejectedById: rejecterEmployeeId,
              rejectedDate: format(new Date(), 'yyyy-MM-dd'),
              rejectionReason: reason
            } 
          : ot
      )
    }));
  },
});
