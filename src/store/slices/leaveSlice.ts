
import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Leave, LeaveType } from '@/types';
import { initialLeaveTypes, initialLeaves } from '@/data/leaveData';

export interface LeaveSlice {
  leaveTypes: LeaveType[];
  leaves: Leave[];
  
  // LeaveType actions
  addLeaveType: (leaveType: Omit<LeaveType, 'id' | 'leaves'>) => void;
  updateLeaveType: (id: string, data: Partial<Omit<LeaveType, 'id' | 'leaves'>>) => void;
  deleteLeaveType: (id: string) => void;
  
  // Leave actions
  addLeave: (leave: Omit<Leave, 'id' | 'numberOfDays' | 'status' | 'createdAt'>) => void;
  updateLeave: (id: string, data: Partial<Omit<Leave, 'id'>>) => void;
  deleteLeave: (id: string) => void;
  
  // Approval actions
  approveDepartment: (id: string, approverId: string) => void;
  approveLeave: (id: string, approverId: string) => void;
  rejectLeave: (id: string, rejectorId: string, reason: string) => void;
}

export const createLeaveSlice: StateCreator<LeaveSlice, [], [], LeaveSlice> = (set, get, api) => ({
  leaveTypes: initialLeaveTypes,
  leaves: initialLeaves,
  
  // LeaveType actions
  addLeaveType: (leaveType) => {
    const newLeaveType: LeaveType = {
      id: uuidv4(),
      ...leaveType,
      leaves: []
    };
    
    set((state) => ({
      leaveTypes: [...state.leaveTypes, newLeaveType]
    }));
  },
  
  updateLeaveType: (id, data) => {
    set((state) => ({
      leaveTypes: state.leaveTypes.map((leaveType) => 
        leaveType.id === id ? { ...leaveType, ...data } : leaveType
      )
    }));
  },
  
  deleteLeaveType: (id) => {
    set((state) => ({
      leaveTypes: state.leaveTypes.filter((leaveType) => leaveType.id !== id)
    }));
  },
  
  // Leave actions
  addLeave: (leave) => {
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
    
    const newLeave: Leave = {
      id: uuidv4(),
      ...leave,
      numberOfDays: diffDays,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    set((state) => ({
      leaves: [...state.leaves, newLeave]
    }));
  },
  
  updateLeave: (id, data) => {
    const leaves = get().leaves;
    const leaveToUpdate = leaves.find(leave => leave.id === id);
    
    if (!leaveToUpdate) return;
    
    // If dates are changed, recalculate number of days
    let numberOfDays = leaveToUpdate.numberOfDays;
    if (data.startDate || data.endDate) {
      const startDate = new Date(data.startDate || leaveToUpdate.startDate);
      const endDate = new Date(data.endDate || leaveToUpdate.endDate);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
    }
    
    set((state) => ({
      leaves: state.leaves.map((leave) => 
        leave.id === id ? { ...leave, ...data, numberOfDays } : leave
      )
    }));
  },
  
  deleteLeave: (id) => {
    set((state) => ({
      leaves: state.leaves.filter((leave) => leave.id !== id)
    }));
  },
  
  // Approval actions
  approveDepartment: (id, approverId) => {
    set((state) => ({
      leaves: state.leaves.map((leave) => 
        leave.id === id 
          ? { 
              ...leave, 
              status: 'department_approved',
              departmentApprovedById: approverId,
              departmentApprovedDate: new Date().toISOString()
            } 
          : leave
      )
    }));
  },
  
  approveLeave: (id, approverId) => {
    set((state) => ({
      leaves: state.leaves.map((leave) => 
        leave.id === id 
          ? { 
              ...leave, 
              status: 'approved',
              approvedById: approverId,
              approvedDate: new Date().toISOString()
            } 
          : leave
      )
    }));
  },
  
  rejectLeave: (id, rejectorId, reason) => {
    set((state) => ({
      leaves: state.leaves.map((leave) => 
        leave.id === id 
          ? { 
              ...leave, 
              status: 'rejected',
              rejectedById: rejectorId,
              rejectedDate: new Date().toISOString(),
              rejectionReason: reason
            } 
          : leave
      )
    }));
  }
});
